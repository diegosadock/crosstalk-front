import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../model/Usuario';
import { Router } from '@angular/router';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {
  usuario!: Usuario;

  public constructor(private router: Router) { }


  ngOnInit(): void {
    if (typeof window !== 'undefined') { // Garante que está no navegador
      const stored = localStorage.getItem("Usuario");
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
  }

  public irParaPerfil(id: number) {
    this.router.navigate(['/profile', id]);
  }
}
