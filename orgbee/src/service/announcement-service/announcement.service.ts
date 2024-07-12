import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { environment } from '../../environments/environment';

export interface Announcement {
  id: number;
  subject: string;
  content: string;
  recipient: number;
  student_id: number;
  updated_at?: string; 
  created_at?: string;  
  author?: string;   
}

@Injectable()

export class AnnouncementService {

  constructor(private http: HttpClient, private datePipe: DatePipe) {}

  getAnnouncements(): Observable<Announcement[]> {
    return this.http.get<Announcement[]>(environment.apiUrl+'/announcements').pipe(
      map((announcements: Announcement[]) => {
        return announcements.map(announcement => {
          return {
            ...announcement,
            created_at: this.formatDate(announcement.created_at)
          };
        });
      })
    );
  }

  private formatDate(dateString: string): string {
    return this.datePipe.transform(dateString, 'MMMM d, yyyy h:mm a') || '';
  }

  createAnnouncement(announcement: Announcement): Observable<number> {
    return this.http.post<{ announcement_id: number }>(environment.apiUrl+'/announcements',  announcement).pipe(
      map(response => response.announcement_id)
    );
  }
  
  updateAnnouncement(id: number, announcement: Announcement): Observable<Announcement> {
    return this.http.put<Announcement>(`${environment.apiUrl}/announcements/${id}`, announcement);
  }

  deleteAnnouncement(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/announcements/${id}`);
  }
}
