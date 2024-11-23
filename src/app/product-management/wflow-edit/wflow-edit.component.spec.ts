import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WflowEditComponent } from './wflow-edit.component';

describe('WflowEditComponent', () => {
  let component: WflowEditComponent;
  let fixture: ComponentFixture<WflowEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WflowEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WflowEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
