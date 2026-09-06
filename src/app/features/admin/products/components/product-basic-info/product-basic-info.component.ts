import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';

import { filter, startWith, switchMap, tap } from 'rxjs';

import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';

import { LucideFileText } from '@lucide/angular';

import BrandService from '../../../../../core/services/brand.service';
import CategoryService from '../../../../../core/services/category.service';
import SubcategoryService from '../../../../../core/services/subcategory.service';

import { Brand } from '../../../../../shared/models/brand.model';
import { Category } from '../../../../../shared/models/category.model';
import { SubCategory } from '../../../../../shared/models/subcategory.model';

import { FieldErrorComponent } from '../../../../../shared/components/field-error/field-error.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-product-basic-info',
  imports: [
    CardModule,
    LucideFileText,
    ReactiveFormsModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    FieldErrorComponent,
  ],
  templateUrl: './product-basic-info.component.html',
  styleUrl: './product-basic-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductBasicInfoComponent implements OnInit {
  destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);

  brandService = inject(BrandService);
  categoryService = inject(CategoryService);
  subcategoryService = inject(SubcategoryService);

  basicInfo = input.required<FormGroup>();
  mode = input.required<'create' | 'edit'>();

  categories: Category[] = [];
  subcategories: SubCategory[] = [];
  brands: Brand[] = [];

  ngOnInit() {
    this.loadBrands();
    this.loadCategories();
    this.loadSubcategories();
  }

  //getter to cleanly access nested controls in template
  getControl(name: string) {
    return this.basicInfo().get(name);
  }

  toUpperCase(control: AbstractControl | null) {
    if (control && control.value) {
      control.setValue(control.value.toUpperCase(), { emitEvent: false });
    }
  }

  private loadBrands() {
    this.brandService.getBrands().subscribe({
      next: (response) => {
        if (response.success) {
          this.brands = response.data ?? [];
        } else {
          console.error('Failed to load brands:', response.message);
        }
      },
      error: (err) => {
        console.error('Error loading brands:', err);
      },
    });
  }

  private loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        if (response.success) {
          this.categories = response.data ?? [];
        } else {
          console.error('Failed to load categories:', response.message);
        }
      },
      error: (err) => {
        console.error('Error loading categories:', err);
      },
    });
  }

  private loadSubcategories() {
    const categoryControl = this.basicInfo().get('category');

    categoryControl?.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => {
          this.basicInfo()
            .get('subcategory')
            ?.setValue(null, { emitEvent: false });
        }),
        startWith(categoryControl.value),
        filter((categoryId): categoryId is string => !!categoryId),
        switchMap((categoryId) =>
          this.subcategoryService.getSubcategoriesByCategoryId(categoryId),
        ),
      )
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.subcategories = response.data ?? [];
            this.cdr.markForCheck();
          } else {
            console.error('Failed to load subcategories:', response.message);
          }
        },
        error: (err) => {
          console.error('Error loading subcategories:', err);
        },
      });
  }
}
