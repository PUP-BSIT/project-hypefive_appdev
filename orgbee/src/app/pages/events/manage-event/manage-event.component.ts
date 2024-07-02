import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { Event } from '../events.component';
import { Member } from '../../members/members.component';
import { ModalButton } from '../events.component';
import { Response } from '../../../app.component';

import { DataService } from '../../../../service/data.service';
import { ConfirmationDialogService } from '../../../../service/confirmation-dialog.service';
import { SpinnerService } from '../../../../service/spinner.service';

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

  imgPath: string = 'http://127.0.0.1:8000/storage/images/event_poster/';
  response:Response;


  constructor(
    private dataService:DataService, 
    private toastr: ToastrService, 
    private confirmationDialogService: ConfirmationDialogService,
    private spinnerService: SpinnerService){}

  ngOnInit(): void {
  }

  closeManageModal(){
    this.closeModal.emit();
  }

  publishDraft(event:Event) {
    const id = {id : event.id};
    this.dataService.publishDraft(id).subscribe((res: Response )=>{
      this.response=res;
      this.handleResponse();

      this.updateState.emit('draft');
      this.closeManageModal();
    });
  }

  markAsOccurring(event: Event): void {
    this.confirmationDialogService.confirmAction('Action Confirmation', 'This action cant be undone. Are you sure you want to mark this event as occuring?', () => {
    const id = {id : event.id};
    this.dataService.markAsOccuring(id).subscribe((res:Response) =>{
      this.response=res;
      this.handleResponse();

      this.updateState.emit('upcoming');
      this.closeManageModal();
    });
  });
}

  markAsComplete(event: Event) {
    this.confirmationDialogService.confirmAction('Action Confirmation', 'This action cant be undone. Are you sure you want mark this event as completed?', () => {
    const id = {id : event.id};
    this.dataService.markAsComplete(id).subscribe((res:Response) =>{
      this.response=res;
      this.handleResponse();

      this.updateState.emit('occuring');
      this.closeManageModal();
    });
  });
}

  cancelEvent(event: Event): void {
    this.confirmationDialogService.confirmAction('Action Confirmation', 'This action cant be undone. Are you sure you want to cancel this event?', () => {
      const id = {id : event.id};
      this.dataService.cancelEvent(id).subscribe((res:Response) =>{
        this.response=res;
        this.handleResponse();
        
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

  handleResponse() {
    if (this.response.code === 200) {
      this.toastr.success(JSON.stringify(this.response.message), '', {
        timeOut: 2000,
        progressBar: true,
        toastClass: 'custom-toast success'
      });
    } else {
      this.toastr.error(JSON.stringify(this.response.message), '', {
        timeOut: 2000,
        progressBar: true,
        toastClass: 'custom-toast error'
      });
    }
  }

}
