import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Postagem } from '../model/Postagem';
import { Observable } from 'rxjs';
import { Midia } from '../model/Midia';

@Injectable({
  providedIn: 'root'
})
export class PostagemService {

  constructor(private http: HttpClient) { }

  criar(postagem: Postagem): Observable<Postagem> {
    return this.http.post<Postagem>(environment.apiURL+"/postagens", postagem);
  }

  listar(): Observable<Postagem[]> {
    return this.http.get<Postagem[]>(environment.apiURL+"/postagens");
  }

  listarPorUsuario(idUsuario: number): Observable<Postagem[]> {
    return this.http.get<Postagem[]>(environment.apiURL+"/postagens/usuario/"+idUsuario)
  }

  criarMidia(midia: Midia): Observable<Midia> {
    return this.http.post<Midia>(`${environment.apiURL}/midias`, midia);
  }

}
