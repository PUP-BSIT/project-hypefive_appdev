import { Component, OnInit } from '@angular/core';

import { DataService } from '../../../../service/data.service';

@Component({
  selector: 'app-admin-data',
  templateUrl: './admin-data.component.html',
  styleUrl: './admin-data.component.css'
})
export class AdminDataComponent implements OnInit {
  currentDay: string;
  currentDate: number;
  today: Date;

  constructor(private dataService: DataService) {}

  memberCount: number;
  eventsCount: number;
  pendingPostCount: number;
  ngOnInit(): void {
    this.today = new Date();
    this.currentDay = this.today.toLocaleString('en-US', { weekday: 'long' });
    this.currentDate = this.today.getDate();

    this.getTotalMembers();
    this.getTotalUpcomingEvents();
    this.getTotalPendingPosts();
  }

  getTotalMembers() {
    this.dataService.getTotalMembers().subscribe((res:number)=>{
      this.memberCount = res;
    });
  }

  getTotalUpcomingEvents() {
    this.dataService.getTotalUpcomingEvents().subscribe((res:number)=>{
      this.eventsCount = res;
    })
  }

  getTotalPendingPosts(){
    this.dataService.getTotalPendingPosts().subscribe((res:number)=>{
      this.pendingPostCount = res;
    })
  }
}
