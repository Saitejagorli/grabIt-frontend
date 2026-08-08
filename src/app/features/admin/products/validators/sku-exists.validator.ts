import { AbstractControl, AsyncValidatorFn } from "@angular/forms";
import { ProductService } from "../../../../core/services/product.service";
import { debounceTime, map, of, switchMap } from "rxjs";


 
export function skuExistsValidator(
  productService: ProductService
): AsyncValidatorFn {

  return (control) => {
    return of(control.value).pipe(
      debounceTime(500),
      switchMap(value =>
        productService.checkSkuExists(value)
      ),
      map(response =>
        response.data?.exists ? { skuError: "Sku already exists" } : null
      )
    );
  };
}