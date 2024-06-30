import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../app/confirmation-dialog/confirmation-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationDialogService {

  constructor(private dialog: MatDialog) { }

  confirmAction(title: string, message: string, callback: () => void) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: { title: title, message: message }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        callback();
      }
    });
  }
}
