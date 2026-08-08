import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

type ErrorMessageFn = (errors: ValidationErrors, label?: string) => string;

const ERROR_MESSAGES: Record<string, ErrorMessageFn> = {
  required: (_e, label) => `${label} is required.`,
  minlength: (e, label) =>
    `${label || 'This field'} must be at least ${e['minlength'].requiredLength} characters.`,
  maxlength: (e, label) =>
    `${label || 'This field'} cannot exceed ${e['maxlength'].requiredLength} characters.`,
  min: (e, label) => `${label || 'Value'} must be at least ${e['min'].min}.`,
  email: () => `Please enter a valid email address.`,
  priceError: (_e, label) => `${label} cannot be greater than MRP.`,
  skuError: (e,label)=>`SKU already exists`
};

@Component({
  selector: 'app-field-error',
  imports: [],
  templateUrl: './field-error.component.html',
  styleUrl: './field-error.component.scss',
})
export class FieldErrorComponent {
  control = input<AbstractControl | null>(null);
  label = input<string>('');

  groupControl = input<AbstractControl | null>(null);

  errorMessage(): string | null {
    const control = this.control();
    if (control?.invalid && (control.touched || control.dirty)) {
      const errors = control.errors;

      if (errors) {
        for (const key of Object.keys(ERROR_MESSAGES)) {
          if (errors[key]) {
            return ERROR_MESSAGES[key](errors, this.label());
          }
        }
      }
    }

    // Group-level errors
    const group = this.groupControl();

    if (group?.hasError('priceError') && (group.touched || group.dirty)) {
      return ERROR_MESSAGES['priceError']({}, this.label());
    }

    return null;
  }
}
