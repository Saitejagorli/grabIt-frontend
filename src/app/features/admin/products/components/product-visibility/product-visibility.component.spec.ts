import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductVisibilityComponent } from './product-visibility.component';

describe('ProductVisibilityComponent', () => {
  let component: ProductVisibilityComponent;
  let fixture: ComponentFixture<ProductVisibilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductVisibilityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductVisibilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
