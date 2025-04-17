import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from '../../model/Usuario';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  usuario!: Usuario;

  constructor(
      private router: Router
    ) {}

    ngOnInit(): void {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem("Usuario");
        if (stored) {
          try {
            const parsedUsuario = JSON.parse(stored);
            this.usuario = {
              idUsuario: parsedUsuario.idUsuario || 0,
              nomeUsuario: parsedUsuario.nomeUsuario || 'Visitante',
              emailUsuario: parsedUsuario.emailUsuario || '',
              senhaUsuario: parsedUsuario.senhaUsuario || '',
              fotoPerfil: parsedUsuario.fotoPerfil || '/assets/profile.jpg',
              dataCadastro: parsedUsuario.dataCadastro || '',
              bio: parsedUsuario.bio || '',
              cidade: parsedUsuario.cidade || '',
              dataNascimento: parsedUsuario.dataNascimento || '',
              status: parsedUsuario.status || 'ativo'
            };
          } catch (e) {
            console.error('Erro ao ler usuário do localStorage:', e);
            this.usuario = this.usuarioPadrao();
          }
        } else {
          this.usuario = this.usuarioPadrao();
        }
      }
    }
  
    private usuarioPadrao(): Usuario {
      return {
        idUsuario: 0,
        nomeUsuario: 'Visitante',
        emailUsuario: '',
        senhaUsuario: '',
        fotoPerfil: '/assets/profile.jpg',
        dataCadastro: '',
        bio: '',
        cidade: '',
        dataNascimento: '',
        status: 'ativo'
      };
    }
  
    public irParaPerfil(id: number): void {
      this.router.navigate(['/profile', id]);
    }
}
