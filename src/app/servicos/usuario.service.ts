import { Injectable } from '@angular/core';
import { Usuario } from '../model/Usuario';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
// Importe o modelo de usuário, se necessário

@Injectable({
  providedIn: 'root' // Isso vai tornar o serviço globalmente disponível
})
export class UsuarioService {

  private usuario!: Usuario;

  constructor(private http: HttpClient) {
    this.carregarUsuario();
  }

  private carregarUsuario(): void {
    const stored = localStorage.getItem('Usuario');
    if (stored) {
      this.usuario = JSON.parse(stored);
    } else {
      this.usuario = {
        idUsuario: 0,
        nomeUsuario: 'Visitante', // Nome padrão para um usuário não autenticado
        emailUsuario: '', // Sem email, pois é um visitante
        senhaUsuario: '', // Sem senha, pois é um visitante
        avatar: '/assets/profile.jpeg', // Foto padrão
        dataCadastro: '', // Data de cadastro vazia ou você pode inicializar com a data atual
        bio: '', // Bio vazia
        cidade: '', // Cidade vazia
        dataNascimento: '', // Data de nascimento vazia
        status: 'ativo' // Status ativo por padrão, mesmo para um visitante
      };
    }
  }

  // Método para obter o usuário
  public getUsuario(): Usuario {
    return this.usuario;
  }

  // Método para atualizar o usuário
  public setUsuario(usuario: Usuario): void {
    this.usuario = usuario;
    localStorage.setItem('Usuario', JSON.stringify(usuario));
  }

  getUsuarioPorId(id: number): Observable<Usuario> {
    const token = localStorage.getItem('CrosstalkTK');

    const headers = {
      Authorization: `Bearer ${token}`
    };

    return this.http.get<Usuario>(`${environment.apiURL}/usuarios/${id}`, { headers });
  }
}
