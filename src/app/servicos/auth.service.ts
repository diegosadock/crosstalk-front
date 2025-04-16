import { Injectable } from '@angular/core';
import { Usuario } from '../model/Usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = 'Usuario'; // Chave correta conforme informado

  // Salva o usuário logado no localStorage
  setUsuario(usuario: Usuario): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(usuario));
  }

  // Recupera o usuário logado do localStorage
  getUsuario(): Usuario | null {
    const usuarioJson = localStorage.getItem(this.STORAGE_KEY);
    return usuarioJson ? JSON.parse(usuarioJson) as Usuario : null;
  }

  // Remove o usuário logado do localStorage
  limparUsuario(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // Verifica se há um usuário logado
  estaLogado(): boolean {
    return this.getUsuario() !== null;
  }
}
