import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Usuario } from '../../model/Usuario';
import { UsuarioService } from '../../servicos/usuario.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'] // <- era 'styleUrl' e estava no singular
})
export class ProfileComponent implements OnInit {
  usuario!: Usuario;
  idUsuario!: number;

  constructor(
    private route: ActivatedRoute,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('idUsuario');
      if (id) {
        this.idUsuario = +id; // converte de string pra number
        this.carregarDadosDoUsuario(this.idUsuario);
      }
    });
  }

  public carregarDadosDoUsuario(id: number) {
    this.usuarioService.getUsuarioPorId(id).subscribe({
      next: (user) => {
        this.usuario = user;
        console.log('Usuário carregado:', this.usuario);
      },
      error: (err) => {
        console.error('Erro ao carregar usuário:', err);
      }
    });
  }
}
