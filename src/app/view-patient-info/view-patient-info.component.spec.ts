// This file has been automatically generated for unit testing via the Karma test runner
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPatientInfoComponent } from './view-patient-info.component';

describe('ViewPatientInfoComponent', () => {
  let component: ViewPatientInfoComponent;
  let fixture: ComponentFixture<ViewPatientInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPatientInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPatientInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
