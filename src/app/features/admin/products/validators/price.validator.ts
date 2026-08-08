import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const priceValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const mrp = control.get('mrp');
  const sellingPrice = control.get('sellingPrice');
  return mrp && sellingPrice && sellingPrice.value > mrp.value
    ? { priceError: 'Selling price cannot be greater than MRP' }
    : null;
};