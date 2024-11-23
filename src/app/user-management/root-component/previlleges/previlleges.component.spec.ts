import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrevillegesComponent } from './previlleges.component';

describe('PrevillegesComponent', () => {
  let component: PrevillegesComponent;
  let fixture: ComponentFixture<PrevillegesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrevillegesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrevillegesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
