import {Injectable} from '@angular/core';
import {ToastrService} from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CustomToastrService {

  constructor(private toastrService: ToastrService) {
  }

  public showSuccessToastr(message: string): void {
    this.toastrService.success(message, '', {
      positionClass: 'toast-bottom-full-width',
      timeOut: 5000
    });
  }

  public showErrorToastr(message: string): void {
    this.toastrService.error(message, '', {
      positionClass: 'toast-bottom-full-width',
      timeOut: 5000
    });
  }

}
