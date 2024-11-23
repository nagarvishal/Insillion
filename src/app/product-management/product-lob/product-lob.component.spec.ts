import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductLobComponent } from './product-lob.component';

describe('ProductLobComponent', () => {
  let component: ProductLobComponent;
  let fixture: ComponentFixture<ProductLobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductLobComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductLobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
