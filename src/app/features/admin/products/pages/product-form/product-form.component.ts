import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';

import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';

import {
  finalize,
  forkJoin,
  map,
  Observable,
  of,
  switchMap,
  take,
  timer,
} from 'rxjs';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Toast } from 'primeng/toast';

import { MediaService } from '../../../../../core/services/media.service';
import { ProductService } from '../../../../../core/services/product.service';

import { ProductBasicInfoComponent } from '../../components/product-basic-info/product-basic-info.component';
import { ProductImagesComponent } from '../../components/product-images/product-images.component';
import { ProductPricingComponent } from '../../components/product-pricing/product-pricing.component';
import { ProductVisibilityComponent } from '../../components/product-visibility/product-visibility.component';

import {
  FileMetaData,
  UploadedImage,
  ImageFile,
  UploadSessionResponse,
} from '../../../../../shared/models/media.model';

import {
  Product,
  ProductImage,
  ProductRequest,
  ProductStatus,
  ProductVisibility,
} from '../../../../../shared/models/product.model';

import { priceValidator } from '../../validators/price.validator';
import { skuExistsValidator } from '../../validators/sku-exists.validator';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

type ProductMode = 'create' | 'edit';
@Component({
  selector: 'app-product-form',
  imports: [
    ProductBasicInfoComponent,
    ReactiveFormsModule,
    ProductImagesComponent,
    ProductPricingComponent,
    ProductVisibilityComponent,
    ButtonModule,
    Toast,
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
  providers: [MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductFormComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(NonNullableFormBuilder);

  private readonly messageService = inject(MessageService);

  private readonly mediaService = inject(MediaService);
  private readonly productService = inject(ProductService);

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly skuValidator = skuExistsValidator(this.productService);

  mode = input<ProductMode>('create');
  isEditMode = computed(() => this.mode() === 'edit');

  loading = signal(false);
  submitted = signal(false);

  // From
  productForm = this.fb.group({
    basicInfo: this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],

      sku: this.fb.control('', {
        validators: [Validators.required, Validators.minLength(3)],
        asyncValidators: [this.skuValidator],
        updateOn: 'blur',
      }),

      description: ['', [Validators.required, Validators.minLength(10)]],

      brand: ['', Validators.required],

      category: ['', Validators.required],

      subcategory: ['', Validators.required],
    }),

    priceInfo: this.fb.group(
      {
        sellingPrice: [
          null as number | null,
          [Validators.required, Validators.min(1)],
        ],

        mrp: [null as number | null, [Validators.required, Validators.min(1)]],
      },
      {
        validators: [priceValidator],
      },
    ),

    visibilityInfo: this.fb.group({
      status: this.fb.control<ProductStatus>(
        ProductStatus.ACTIVE,
        Validators.required,
      ),

      visibility: this.fb.control<ProductVisibility>(
        ProductVisibility.VISIBLE,
        Validators.required,
      ),
    }),

    images: this.fb.array<ProductImage | null>(
      [],
      [Validators.required, Validators.maxLength(4)],
    ),
  });

  ngOnInit() {
    const productId = this.activatedRoute.snapshot.paramMap.get('id');
    if (productId && this.isEditMode()) {
      this.productForm
        ?.get('basicInfo.sku')
        ?.removeAsyncValidators(this.skuValidator);

      this.productService.getProductById(productId).subscribe((response) => {
        if (response.success && response.data) {
          this.fillForm(response.data);
        }
      });
    }
  }

  fillForm(product: Product) {
    this.productForm.patchValue({
      basicInfo: {
        name: product.name,
        description: product.description,
        sku: product.sku,
        brand: product.brandId,
        category: product.categoryId,
        subcategory: product.subCategoryId,
      },
      priceInfo: {
        sellingPrice: product.sellingPrice,
        mrp: product.mrp,
      },
      visibilityInfo: {
        status: product.status,
        visibility: product.visibility,
      },
    });

    const images = product.images ?? [];
    images.sort((a, b) => a.displayOrder - b.displayOrder);

    const imageControls = product.images?.map(
      (image) => new FormControl<ProductImage>(image),
    );

    this.productForm.setControl('images', this.fb.array(imageControls!));
  }

  onSubmit(): void {
    this.loading.set(true);
    this.submitted.set(true);

    // 1. Validate form
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      this.loading.set(false);
      return;
    }

    // 2. get the form value
    const formValue = this.productForm.getRawValue();
    console.log('Form Value:', formValue);

    // 3. Get actual File objects
    const files = formValue.images
      .map((image, index) => {
        if (image != null) {
          image.displayOrder = index;
        }
        return image;
      })
      .filter((image): image is ImageFile => image instanceof File);

    /*
     * COMPLETE FLOW
     *
     * 1. Create upload session
     *              ↓
     * 2. Get presigned S3 URLs
     *              ↓
     * 3. Upload files directly to S3
     *              ↓
     * 4. Complete upload session
     *              ↓
     * 5. Create product
     */

    // 5. Create upload session
    this.uploadImages(files)
      .pipe(
        switchMap((sessionId) => {
          return this.saveProduct(sessionId!);
        }),

        finalize(() => {
          this.loading.set(false);
        }),
      )
      .subscribe({
        next: (response) => {
          console.log('Product saved successfully:', response);

          if (this.isEditMode()) {
            this.fillForm(response.data!);
            this.submitted.set(false);
          }

          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: this.isEditMode()
              ? 'Product updated successfully'
              : 'Product created successfully',
            life: 2000,
          });

          timer(2000)
            .pipe(take(1), takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
              this.router.navigate(['/admin/products', response.data?.id]);
            });
        },

        error: (error) => {
          console.error('Product save failed:', error);

          this.submitted.set(false);

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error occurred while saving product.',
            life: 2000,
          });
        },
      });
  }

  private uploadImages(files: ImageFile[]): Observable<string | null> {
    if (files.length === 0) {
      return of(null);
    }

    const images: FileMetaData[] = files.map((file) => ({
      fileName: file.name,
      contentType: file.type,
      size: file.size,
      displayOrder: file.displayOrder,
    }));

    return this.mediaService.createUploadSession(images).pipe(
      switchMap((uploadSession) =>
        this.uploadFilesToS3(files, uploadSession).pipe(
          switchMap(() =>
            this.mediaService.completeUploadSession(uploadSession.sessionId),
          ),
        ),
      ),
      map((completedSession) => completedSession.sessionId),
    );
  }

  // UPLOAD FILES TO S3
  private uploadFilesToS3(
    files: File[],
    uploadResponse: UploadSessionResponse,
  ): Observable<void[]> {
    const uploads = uploadResponse.filesUploadResponse.map(
      (fileUploadResponse) => {
        // Find the original File
        const file = files.find(
          (file) => file.name === fileUploadResponse.fileName,
        );

        // File wasn't found
        if (!file) {
          throw new Error(`File not found: ${fileUploadResponse.fileName}`);
        }

        // Upload directly to S3
        return this.mediaService.uploadFiletoS3(fileUploadResponse.url, file);
      },
    );

    // Wait until ALL uploads complete
    return forkJoin(uploads);
  }

  // Create Product
  private saveProduct(uploadSessionId: string) {
    const formValue = this.productForm.getRawValue();

    const request: ProductRequest = {
      // Basic information
      name: formValue.basicInfo.name,
      description: formValue.basicInfo.description,
      sku: formValue.basicInfo.sku,

      // Price information
      mrp: formValue.priceInfo.mrp!,
      sellingPrice: formValue.priceInfo.sellingPrice!,

      // Visibility information
      status: formValue.visibilityInfo.status,
      visibility: formValue.visibilityInfo.visibility,

      // Relationships
      brandId: formValue.basicInfo.brand,
      categoryId: formValue.basicInfo.category,
      subCategoryId: formValue.basicInfo.subcategory,

      // Media
      imageUploadSessionId: uploadSessionId,
    };

    if (this.isEditMode()) {
      const retainedImages = formValue.images
        .filter((image): image is UploadedImage => 'id' in image!)
        .map((image) => ({
          id: image.id,
          displayOrder: image.displayOrder,
        }));
      request.retainedImages = retainedImages;
      return this.productService.updateProduct(
        this.activatedRoute.snapshot.paramMap.get('id')!,
        request,
      );
    }

    console.log('Create Product Request:', request);
    return this.productService.createProduct(request);
  }
}
