import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';


import { CardModule } from 'primeng/card';
import { SelectButtonModule } from 'primeng/selectbutton';
import { LucideEye } from '@lucide/angular';

import { FieldErrorComponent } from '../../../../../shared/components/field-error/field-error.component';

@Component({
  selector: 'app-product-visibility',
  imports: [
    CardModule,
    LucideEye,
    SelectButtonModule,
    ReactiveFormsModule,
    FieldErrorComponent,
  ],
  templateUrl: './product-visibility.component.html',
  styleUrl: './product-visibility.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductVisibilityComponent {
  visibilityInfo = input.required<FormGroup>();

  readonly statusOptions = [
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Inactive', value: 'INACTIVE' },
  ];

  readonly visibilityOptions = [
    { label: 'Visible', value: 'VISIBLE' },
    { label: 'Hidden', value: 'HIDDEN' },
  ];

  // getter to cleanly access nested controls in template
  getControl(name: string) {
    return this.visibilityInfo().get(name);
  }
}
