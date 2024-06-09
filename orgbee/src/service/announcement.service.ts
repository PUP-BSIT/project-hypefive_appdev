import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

export interface Announcement {
  id: number;
  subject: string;
  content: string;
  recipient: number;
  student_id: number;
}

export interface AnnouncementDisplay {
  id: number;
  subject: string;
  content: string;
  recipient: number;
  created_at: string;
  author: string;
}

@Injectable({
  providedIn: 'root'
})

export class AnnouncementService {
  private apiUrl = 'http://127.0.0.1:8000/api/announcements';

  constructor(private http: HttpClient, private datePipe: DatePipe) {}

  getAnnouncements(): Observable<AnnouncementDisplay[]> {
    return this.http.get<AnnouncementDisplay[]>(this.apiUrl).pipe(
      map((announcements: AnnouncementDisplay[]) => {
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
    return this.datePipe.transform(dateString, 'MMMM d, yyyy');
  }

  createAnnouncement(announcement: Announcement): Observable<number> {
    return this.http.post<{ announcement_id: number }>(this.apiUrl, announcement).pipe(
      map(response => response.announcement_id)
    );
  }
  
  updateAnnouncement(id: number, announcement: Announcement): Observable<Announcement> {
    return this.http.put<Announcement>(`${this.apiUrl}/${id}`, announcement);
  }

  deleteAnnouncement(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}