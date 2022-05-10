import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../services/patient.service';

@Component({
  selector: 'app-view-patient-info',
  templateUrl: './view-patient-info.component.html',
  styleUrls: ['./view-patient-info.component.css']
})
export class ViewPatientInfoComponent implements OnInit {

  constructor(
    private service: PatientService,
    private router: Router,
    private activeRouter: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activeRouter.params.subscribe(
      (params) => {
        console.log(params);
      }
    )
  }

}
