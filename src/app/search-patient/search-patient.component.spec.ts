// This file has been automatically generated for unit testing via the Karma test runner
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchPatientComponent } from './search-patient.component';

describe('SearchPatientComponent', () => {
  let component: SearchPatientComponent;
  let fixture: ComponentFixture<SearchPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchPatientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
