import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePluginsComponent } from './manage-plugins.component';

describe('ManagePluginsComponent', () => {
  let component: ManagePluginsComponent;
  let fixture: ComponentFixture<ManagePluginsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManagePluginsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManagePluginsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
