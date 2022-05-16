// This file has been automatically generated for unit testing via the Karma test runner
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUpdateEmployeeComponent } from './view-update-employee.component';

describe('ViewUpdateEmployeeComponent', () => {
  let component: ViewUpdateEmployeeComponent;
  let fixture: ComponentFixture<ViewUpdateEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewUpdateEmployeeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewUpdateEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
