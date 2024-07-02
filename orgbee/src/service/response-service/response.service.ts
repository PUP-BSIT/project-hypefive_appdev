import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

export interface Response {
  message: string;
  code: number;
}

@Injectable()

export class ResponseService {

  constructor(private toastr: ToastrService) { }

  handleResponse(response: Response) {
    if (response.code === 200) {
      this.toastr.success(JSON.stringify(response.message), '', {
        timeOut: 2000,
        progressBar: true,
        toastClass: 'custom-toast success'
      });
    } else {
      this.toastr.error(JSON.stringify(response.message), '', {
        timeOut: 2000,
        progressBar: true,
        toastClass: 'custom-toast error'
      });
    }
  }
}
