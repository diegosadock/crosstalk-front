import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Usuario } from '../../model/Usuario';
import { UsuarioService } from '../../servicos/usuario.service';
import { Postagem } from '../../model/Postagem';
import { PostagemService } from '../../servicos/postagem.service';
import { AuthService } from '../../servicos/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  usuario!: Usuario;
  idUsuario!: number;
  postagens: Postagem[] = [];
  usuarioLogado!: Usuario | null;

  constructor(
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private postagemService: PostagemService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.usuarioLogado = this.authService.getUsuario(); // Recupera o usuário logado
    console.log('Usuário logado:', this.usuarioLogado);

    this.route.paramMap.subscribe(params => {
      const id = params.get('idUsuario');
      if (id) {
        this.idUsuario = +id; // Converte string para número
        console.log('ID no perfil da URL:', this.idUsuario);
        this.carregarDadosDoUsuario(this.idUsuario);
        this.carregarPostagensDoUsuario(this.idUsuario);
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

  private carregarPostagensDoUsuario(id: number) {
    this.postagemService.listarPorUsuario(id).subscribe({
      next: (posts) => {
        this.postagens = posts.sort((a, b) => {
          const dataA = a.dataPostagem ? new Date(a.dataPostagem) : new Date(0);
          const dataB = b.dataPostagem ? new Date(b.dataPostagem) : new Date(0);
          return dataB.getTime() - dataA.getTime(); // Mais recente primeiro
        });
      },
      error: (err) => {
        console.error('Erro ao carregar postagens do usuário:', err);
      }
    });
  }
}
