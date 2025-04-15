import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Usuario } from '../model/Usuario';
import { CrosstalkToken } from '../model/CrosstalkToken';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  public efetuarLogin(usuario: Usuario): Observable<CrosstalkToken> {
    return this.http.post<CrosstalkToken>(environment.apiURL + "/login", usuario);
  }
}
