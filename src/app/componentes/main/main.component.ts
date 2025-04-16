import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../model/Usuario';
import { Router } from '@angular/router';
import { PostagemService } from '../../servicos/postagem.service';
import { Postagem } from '../../model/Postagem';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  usuario!: Usuario;
  postagens: Postagem[] = [];
  postagem: Postagem = {} as Postagem; // ✅ Inicialização evita erro no template

  constructor(
    private router: Router,
    private postagemService: PostagemService
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
            avatar: parsedUsuario.avatar || '/assets/profile.jpeg',
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

      this.carregarPostagens();
    }
  }

  private usuarioPadrao(): Usuario {
    return {
      idUsuario: 0,
      nomeUsuario: 'Visitante',
      emailUsuario: '',
      senhaUsuario: '',
      avatar: '/assets/profile.jpeg',
      dataCadastro: '',
      bio: '',
      cidade: '',
      dataNascimento: '',
      status: 'ativo'
    };
  }

  public irParaPerfil(id: number): void {
    this.router.navigate(['/profile', id]).then(() => {
      window.scrollTo(0,0);
    });
  }

  public carregarPostagens(): void {
    this.postagemService.listar().subscribe({
      next: (postagens) => {
        // ✅ Inverte as postagens para exibir as mais novas no topo
        this.postagens = postagens.reverse();
      },
      error: (err) => console.error('Erro ao carregar postagens:', err)
    });
  }

  public publicar(): void {
    if (!this.postagem || !this.postagem.conteudo || !this.postagem.conteudo.trim()) return;

    const novaPostagem: Postagem = {
      conteudo: this.postagem.conteudo,
      dataPostagem: new Date().toISOString(),
      usuario: this.usuario
    };

    this.postagemService.criar(novaPostagem).subscribe({
      next: (postCriado) => {
        this.postagens.unshift(postCriado); // ✅ Adiciona no topo da lista
        this.postagem = {} as Postagem;     // ✅ Limpa o campo de texto
      },
      error: (err) => console.error('Erro ao publicar:', err)
    });
  }

  
}
