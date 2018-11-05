import { Component, OnInit } from '@angular/core';
import {ErrorService} from '../../services/error.service';
import {MsToDatePipe} from '../../pipes/msToDate.pipe';

@Component({
  selector: 'admin-errors',
  templateUrl: './admin-errors.component.html',
  styleUrls: ['./admin-errors.component.css']
})

export class AdminErrorsComponent implements OnInit {

  serverErrors;
  clientErrors;

  constructor(private errorService: ErrorService) { }

  ngOnInit() {
    this.errorService.getAllErrors().subscribe( (errors: any) => {
      console.log('succesfully retrieved errors', errors)
      this.clientErrors = errors.obj.clientErrors;
      this.serverErrors = errors.obj.serverErrors;
    });
  }


}
