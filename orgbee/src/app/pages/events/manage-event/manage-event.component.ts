import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { Event } from '../../../../service/event-service/event.service';
import { Member } from '../../../../service/member-service/member.service';
import { ModalButton } from '../../../../service/event-service/event.service';
import { Response } from '../../../../service/response-service/response.service';
import { ResponseService } 
  from '../../../../service/response-service/response.service';

import { EventService } from '../../../../service/event-service/event.service';
import { ConfirmationDialogService } from '../../../../service/confirmation-dialog-service/confirmation-dialog.service';
import { SpinnerService } from '../../../../service/spinner-service/spinner.service';

@Component({
  selector: 'app-manage-event',
  templateUrl: './manage-event.component.html',
  styleUrl: './manage-event.component.css'
})
export class ManageEventComponent implements OnInit {
  @Input() isManageModalVisible:boolean;
  @Input() selectedEvent: Event;
  @Input() cancelEventTab:string;
  @Input() modalButton: ModalButton;
  @Input() members:Member[];
  
  @Output() closeModal = new EventEmitter<void>();
  @Output() updateState = new EventEmitter<string>();
  @Output() cancelUpdate = new EventEmitter<string>();
  @Output() editEventModal = new EventEmitter<void>();

  response:Response;

  constructor(
    private eventService:EventService, 
    private confirmationDialogService: ConfirmationDialogService,
    private spinnerService: SpinnerService,
    private responseService: ResponseService){}

  ngOnInit(): void {
  }

  closeManageModal(){
    this.closeModal.emit();
  }

  publishDraft(event:Event) {
    const id = {id : event.id};
    this.eventService.publishDraft(id).pipe(
      catchError((error) => {
        this.spinnerService.hide();

        if (!navigator.onLine) {
          this.responseService.handleError
            ('You are offline. Please check your internet connection.');
        } else {
          this.responseService.handleError
            (`An error occurred while updating event state. 
              Please try again.`);
        }

        // Return an empty observable to complete the pipe
        return of(null);
      })
    ).subscribe((res: Response )=>{
      this.response=res;
      this.responseService.handleResponse(this.response);

      this.updateState.emit('draft');
      this.closeManageModal();
    });
  }

  markAsOccurring(event: Event): void {
    this.confirmationDialogService.confirmAction('Action Confirmation', 
      `This action cant be undone. Are you sure you want to mark this event 
       as occuring?`, () => {
        const id = {id : event.id};
        this.eventService.markAsOccuring(id).pipe(
          catchError((error) => {
            this.spinnerService.hide();

            if (!navigator.onLine) {
              this.responseService.handleError
                ('You are offline. Please check your internet connection.');
            } else {
              this.responseService.handleError
                (`An error occurred while updating event state. 
                  Please try again.`);
            }

            // Return an empty observable to complete the pipe
            return of(null);
          })
        ).subscribe((res:Response) =>{
          this.response=res;
          this.responseService.handleResponse(this.response);

          this.updateState.emit('upcoming');
          this.closeManageModal();
        });
  });
}

  markAsComplete(event: Event) {
    this.confirmationDialogService.confirmAction('Action Confirmation', 
      `This action cant be undone. Are you sure you want mark this event 
       as completed?`, () => {
        const id = {id : event.id};
        this.eventService.markAsComplete(id).pipe(
          catchError((error) => {
            this.spinnerService.hide();

            if (!navigator.onLine) {
              this.responseService.handleError
                ('You are offline. Please check your internet connection.');
            } else {
              this.responseService.handleError
                (`An error occurred while updating event state. 
                  Please try again.`);
            }

            // Return an empty observable to complete the pipe
            return of(null);
          })
        ).subscribe((res:Response) =>{
          this.response=res;
          this.responseService.handleResponse(this.response);

          this.updateState.emit('occuring');
          this.closeManageModal();
        });
  });
}

  cancelEvent(event: Event): void {
    this.confirmationDialogService.confirmAction('Action Confirmation', 
      `This action cant be undone. Are you sure you want to cancel this event?`, 
       () => {
        const id = {id : event.id};
        this.eventService.cancelEvent(id).pipe(
          catchError((error) => {
            this.spinnerService.hide();

            if (!navigator.onLine) {
              this.responseService.handleError
                ('You are offline. Please check your internet connection.');
            } else {
              this.responseService.handleError
                (`An error occurred while updating event state. 
                  Please try again.`);
            }

            // Return an empty observable to complete the pipe
            return of(null);
          })
        ).subscribe((res:Response) =>{
          this.response=res;
          this.responseService.handleResponse(this.response);
          
          //Update current tab event list
          if (this.cancelEventTab === 'UPCOMING') {
            this.updateState.emit('upcoming');
            this.cancelEventTab = "";
          } else if (this.cancelEventTab === 'OCCURING') {
            this.updateState.emit('occuring');
            this.cancelEventTab = "";
          } else if (this.cancelEventTab === 'DRAFT') {
            this.updateState.emit('draft');
            this.cancelEventTab = "";
          }

          this.closeManageModal();
        });
    });
  }

  editEvent(): void {
    this.editEventModal.emit();
  }

}
