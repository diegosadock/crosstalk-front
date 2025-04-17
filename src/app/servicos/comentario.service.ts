// src/app/services/comentario.service.ts

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Comentario } from '../model/Comentario';

@Injectable({
  providedIn: 'root'
})
export class ComentarioService {

  constructor(private http: HttpClient) { }

  recuperarTodos(): Observable<Comentario[]> {
    return this.http.get<Comentario[]>(`${environment.apiURL}/comentarios`);
  }

  recuperarPeloId(id: number): Observable<Comentario> {
    return this.http.get<Comentario>(`${environment.apiURL}/comentarios/${id}`);
  }

  recuperarPorPostagemId(postagemId: number): Observable<Comentario[]> {
    return this.http.get<Comentario[]>(`${environment.apiURL}/comentarios/postagem/${postagemId}`);
  }

  criarNovo(comentario: Comentario): Observable<Comentario> {
    return this.http.post<Comentario>(`${environment.apiURL}/comentarios`, comentario);
  }
}
