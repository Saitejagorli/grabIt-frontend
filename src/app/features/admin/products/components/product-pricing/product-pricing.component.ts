import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Card } from 'primeng/card';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputNumberModule } from 'primeng/inputnumber';

import { LucideTag } from '@lucide/angular';

import { FieldErrorComponent } from '../../../../../shared/components/field-error/field-error.component';

@Component({
  selector: 'app-product-pricing',
  imports: [
    Card,
    LucideTag,
    InputGroupModule,
    InputGroupAddonModule,
    InputNumberModule,
    ReactiveFormsModule,
    FieldErrorComponent,
  ],
  templateUrl: './product-pricing.component.html',
  styleUrl: './product-pricing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductPricingComponent {
  priceInfo = input.required<FormGroup>();

  // Helper getter to cleanly access nested controls in template
  getControl(name: string) {
    return this.priceInfo().get(name);
  }
}
