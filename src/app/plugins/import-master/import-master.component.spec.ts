import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportMasterComponent } from './import-master.component';

describe('ImportMasterComponent', () => {
  let component: ImportMasterComponent;
  let fixture: ComponentFixture<ImportMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImportMasterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImportMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
