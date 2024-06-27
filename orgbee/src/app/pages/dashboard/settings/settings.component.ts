import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  @Input() showSettings: boolean = false;
  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  ngOnInit(): void {
    
  }
  closeModal() {
    this.showSettings = false;
    this.close.emit(); 
  }
}
