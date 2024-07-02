import { Component, OnInit } from '@angular/core';
import { SpinnerService } from '../../service/spinner.service';

@Component({
  selector: 'app-custom-spinner',
  templateUrl: './custom-spinner.component.html',
  styleUrls: ['./custom-spinner.component.css']
})
export class CustomSpinnerComponent implements OnInit {
  spinnerState: { isLoading: boolean, message: string };

  constructor(private spinnerService: SpinnerService) {}

  ngOnInit() {
    this.spinnerService.spinnerState$.subscribe(state => {
      this.spinnerState = state;
    });
  }
}
