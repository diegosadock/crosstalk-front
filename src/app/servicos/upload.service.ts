import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { TokenService } from './token.service';
import { PathToFile } from '../model/PathToFile';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private http: HttpClient, private tokenService: TokenService) { }

  public uploadFile(formData: FormData): Observable<PathToFile> {
    let header = this.tokenService.getTokenHeader();
    return this.http.post<PathToFile>(environment.apiURL + "/upload", formData, { headers: header });
  }
}
