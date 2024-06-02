import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Announcement {
  id: number;
  subject: string;
  content: string;
  recipient: string;
}

@Injectable({
  providedIn: 'root'
})

export class AnnouncementService {
  private apiUrl = 'http://127.0.0.1:8000/api/announcements';

  constructor(private http: HttpClient) {}

  getAnnouncements(): Observable<Announcement[]> {
    return this.http.get<Announcement[]>(this.apiUrl);
  }

  createAnnouncement(announcement: Announcement): Observable<number> {
    return this.http.post<any>(this.apiUrl, announcement).pipe(
      map((response: any) => response.announcement_id)
    );
  }
  
  updateAnnouncement(id: number, announcement: Announcement): Observable<Announcement> {
    return this.http.put<Announcement>(`${this.apiUrl}/${id}`, announcement);
  }

  deleteAnnouncement(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
