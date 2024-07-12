import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

export interface Response {
  message: string;
  code?: number;
}

@Injectable()
export class ResponseService {

  constructor(private toastr: ToastrService) { }

  handleResponse(response: Response) {
    if (response.code === 200) {
      this.handleSuccess(response.message);
    } else {
      this.handleError(response.message);
    }
  }

  handleSuccess(response: string){
    this.toastr.success(response, '', {
      timeOut: 2000,
      progressBar: true,
      toastClass: 'custom-toast success'
    });
  }

  handleError(response: string){
    this.toastr.error(response, '', {
      timeOut: 2000,
      progressBar: true,
      toastClass: 'custom-toast error'
    });
  }
}
