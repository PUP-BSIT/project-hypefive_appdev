import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()

export class ArchiveService {

  constructor(private http:HttpClient) { }

  getYearlyEvents() {
    return this.http.get(environment.apiUrl +'/getYearlyEvents/');
  }

  getOldEvents() {
    return this.http.get(environment.apiUrl +'/getOldEvents/');
  }

  searchArchive(data) {
    return this.http.get(environment.apiUrl +
      `/archive/search_archive?search_archive=${data}`);
  }
}
