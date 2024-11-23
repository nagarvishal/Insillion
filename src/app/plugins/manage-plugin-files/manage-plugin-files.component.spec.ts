import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePluginFilesComponent } from './manage-plugin-files.component';

describe('ManagePluginFilesComponent', () => {
  let component: ManagePluginFilesComponent;
  let fixture: ComponentFixture<ManagePluginFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManagePluginFilesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManagePluginFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
