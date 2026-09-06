import { ChangeDetectionStrategy, Component, input, OnDestroy } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
import { NgClass } from '@angular/common';

import { CardModule } from 'primeng/card';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';

import { LucideImage, LucideCloudUpload, LucidePlus } from '@lucide/angular';

import { environment } from '../../../../../../environments/environment.development';
import { ImageFile } from '../../../../../shared/models/media.model';
import { ProductImage } from '../../../../../shared/models/product.model';

@Component({
  selector: 'app-product-images',
  imports: [
    NgClass,
    CardModule,
    FileUploadModule,
    ButtonModule,
    LucideImage,
    LucideCloudUpload,
    LucidePlus,
  ],
  templateUrl: './product-images.component.html',
  styleUrl: './product-images.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductImagesComponent implements OnDestroy {
  readonly MAX_FILES = 4;
  readonly MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes
  readonly ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png'];

  images = input.required<FormArray<FormControl<ProductImage | null>>>();

  isDragging = false;
  errorMessage: string | null = null;
  replaceMainImage = input<boolean>(false);

  //Revoke all object URLs on component destroy to prevent memory leaks
  ngOnDestroy() {
    this.images().value.forEach((image) => {
      if (image instanceof File && image.url) {
        URL.revokeObjectURL(image.url);
      }
    });
  }

  //Prevent default behavior to allow drop & enable highlight
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  //Remove highlight when dragging leaves the box
  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  // Handle dropped files & remove highlight
  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      const files = Array.from(event.dataTransfer.files);
      this.handleFiles(files);
    }
  }

  // Handle files chosen via button/click
  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const files = Array.from(input.files);
      this.handleFiles(files);
      input.value = ''; // Reset input so same file can be re-selected
    }
  }

  private handleFiles(incomingFiles: File[]) {
    this.errorMessage = null;

    if (this.images().length + incomingFiles.length > this.MAX_FILES) {
      this.errorMessage = `You can only upload up to ${this.MAX_FILES} images.`;
      return;
    }

    if (!this.validImages(incomingFiles)) {
      return;
    }

    incomingFiles.forEach((file) => {
      const url = URL.createObjectURL(file);
      const image: ProductImage = file as ImageFile;
      image.url = url;
      this.images().push(new FormControl(image as ProductImage));
    });
  }

  removeFile(index: number) {
    if (index < this.images().length) {
      const image = this.images().at(index).value as ProductImage;

      if (image instanceof File && image.url) {
        URL.revokeObjectURL(image.url);
      }

      this.images().removeAt(index);
      this.errorMessage = null;
    }
  }

  onMainImageChange(event: Event) {
    const input = event.target as HTMLInputElement;

    // 1. Verify a file was selected
    if (!input.files || input.files.length === 0) return;

    const newFile = input.files[0];

    if (!this.validImages([newFile])) {
      return;
    }

    // 2. Create object URL for preview
    const url = URL.createObjectURL(newFile);

    // 3. Construct the updated image object
    const updatedFirstImage: ImageFile = newFile as ImageFile;
    updatedFirstImage.url = url;

    // 4. Replace index 0 with the new image
    if (this.images().length > 0) {
      //revoke old object URL to prevent memory leaks if you generated it with createObjectURL
      const oldImage = this.images().at(0).value as ImageFile;

      if (oldImage instanceof File) {
        URL.revokeObjectURL(oldImage.url ?? '');
      }
      this.images().setControl(0, new FormControl(updatedFirstImage));
    }

    // 5. Reset the input value to allow re-selection of the same file if needed
    input.value = '';
  }

  validImages(incomingFiles: File[]): boolean {
    for (const file of incomingFiles) {
      if (!this.ALLOWED_FILE_TYPES.includes(file.type.toLowerCase())) {
        this.errorMessage = `Invalid file type: ${file.name}. Only JPG, PNG, JPEG are allowed.`;
        return false;
      }

      if (file.size > this.MAX_FILE_SIZE) {
        this.errorMessage = `File too large: ${file.name}. Max size is 2MB.`;
        return false;
      }
    }
    return true;
  }

  getImageUrl(index: number): string {
    const image = this.images().at(index).value;
    if (image instanceof File) {
      return image.url ?? '';
    }
    return `${environment.CDN_URL}/${image?.objectKey}`;
  }
}
