import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PostagemService } from '../../servicos/postagem.service';
import { Postagem } from '../../model/Postagem';
import { UploadService } from '../../servicos/upload.service';
import { PathToFile } from '../../model/PathToFile';
import { Usuario } from '../../model/Usuario';
import { Midia } from '../../model/Midia';
import { ComentarioService } from '../../servicos/comentario.service';
import { Comentario } from '../../model/Comentario';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  usuario!: Usuario;
  postagens: Postagem[] = [];
  postagem: Postagem = {} as Postagem;
  public msgModal: string = "";
  public estiloMsg: string = "";
  private pathToFile: PathToFile = new PathToFile();
  public loading: boolean = false;
  private mode: string = "";
  public midiaDesc: string = "";
  public comentario: Comentario = {} as Comentario;
  public comentarios: { [postId: number]: Comentario } = {};
  respostasPorPostagem: { [postagemId: number]: Comentario[] } = {};
  comentando: { [postagemId: number]: boolean } = {};
  public modalAberto: boolean = false;
  modalConteudo: string = '';
  @ViewChild('comentarioInput') comentarioInput!: ElementRef<HTMLTextAreaElement>;
  comentariosPostagem: { [key: string]: any } = {};
  public postagemAtual: Postagem | null = null;

  constructor(
    private router: Router,
    private postagemService: PostagemService,
    private uploadService: UploadService,
    private comentarioService: ComentarioService
  ) { }

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
            fotoPerfil: parsedUsuario.fotoPerfil || "/assets/profile.jpg",
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
      fotoPerfil: '/assets/profile.jpg',
      dataCadastro: '',
      bio: '',
      cidade: '',
      dataNascimento: '',
      status: 'ativo'
    };
  }

  public irParaPerfil(id: number): void {
    this.router.navigate(['/profile', id]).then(() => {
      window.scrollTo(0, 0);
    });
  }

  public carregarPostagens(): void {
    this.postagemService.listar().subscribe({
      next: (postagens) => {
        this.postagens = postagens.reverse();
        // Inicializar os comentários para cada postagem
        this.postagens.forEach(post => {
          this.comentarios[post.id] = {} as Comentario;
          this.carregarRespostas(post.id); // para garantir que apareçam ao carregar
        });
      },
      error: (err) => console.error('Erro ao carregar postagens:', err)
    });
  }

  public publicar(): void {
    if (!this.postagem || !this.postagem.conteudo || !this.postagem.conteudo.trim()) {
      console.log("Postagem inválida");
      return;
    }

    const agora = new Date();
    const fusoHorarioBrasil = -3;
    agora.setHours(agora.getHours() + fusoHorarioBrasil);

    // Simular mídia se não houver nenhuma
    if (!this.postagem.midias || this.postagem.midias.length === 0) {
      const midiaTeste: Midia = {
        descricao: "Imagem de teste",
        linkMidia: "/assets/media/imagem-teste.jpg", // caminho fictício
        postagem: { id: 0 } // id será corrigido após o post ser criado
      };
      this.postagem.midias = [midiaTeste];
    }

    const novaPostagem: Postagem = {
      id: this.postagem.id,
      conteudo: this.postagem.conteudo,
      dataPostagem: agora.toISOString(),
      midias: this.postagem.midias,
      usuario: this.usuario
    };

    this.postagemService.criar(novaPostagem).subscribe({
      next: (postCriado) => {
        if (!postCriado.id) {
          console.error("Postagem criada sem ID!");
          return;
        }

        // Atualiza as mídias com o ID correto da postagem
        this.postagem.midias.forEach((midia) => {
          const novaMidia: Midia = {
            descricao: midia.descricao,
            linkMidia: midia.linkMidia,
            postagem: { id: postCriado.id }
          };

          this.postagemService.criarMidia(novaMidia).subscribe({
            next: () => console.log("Mídia simulada salva com sucesso."),
            error: (err) => {
              console.error("Erro ao salvar mídia:", err);
              alert("Erro ao salvar mídia. Tente novamente.");
            }
          });
        });

        this.postagens.unshift(postCriado);
        this.postagem = {} as Postagem;
      },
      error: (err) => {
        console.error('Erro ao publicar:', err);
        alert('Erro ao publicar a postagem. Tente novamente.');
      }
    });
  }

  public realizarUpload(data: any): void {
    let file = data.target.files[0];
    let formData = new FormData();
    formData.append("arquivo", file, file.name);

    this.loading = true;

    this.uploadService.uploadFile(formData).subscribe({
      next: (res: PathToFile) => {
        this.loading = false;
        this.pathToFile = res;
        this.exibirModal("Upload Realizado");

        if (this.mode == 'profile') {
          this.postagem.imagemUrl = "/assets/media/" + this.pathToFile.path;
        } else {
          let midia: Midia = new Midia();
          midia.descricao = this.midiaDesc || "Imagem enviada";
          midia.linkMidia = "/assets/media/" + this.pathToFile.path;
          if (!this.postagem.midias) this.postagem.midias = [];
          this.postagem.midias.push(midia);
        }
      },
      error: (err: any) => {
        this.loading = false;
        this.exibirModal("Falha ao realizar Upload");
      }
    });
  }

  public chamarUpload(): void {
    document.getElementById("btnModalUpload")?.click();
  }

  public exibirModal(mensagem: string): void {
    this.msgModal = mensagem;
    document.getElementById("btnModalAlerta")?.click();
  }

  onImagemSelecionada(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.postagem.imagemUrl = e.target.result;
        let midia: Midia = new Midia();
        midia.descricao = "Imagem do post";
        midia.linkMidia = e.target.result;
        if (!this.postagem.midias) this.postagem.midias = [];
        this.postagem.midias.push(midia);
      };
      reader.readAsDataURL(file);
    }
  }

  public comentar(): void {
    if (!this.postagemAtual) {
      console.error("Nenhuma postagem selecionada.");
      return;
    }
  
    const postagemId = this.postagemAtual.id;
    const conteudo = this.comentarios[postagemId]?.conteudo?.trim();

    if (!conteudo) {
      console.error("Comentário vazio ou inválido");
      return;
    }
  
    const novoComentario: Comentario = {
      conteudo,
      usuario: this.usuario,
      postagem: this.postagemAtual,
      dataComentario: new Date().toISOString()
    };
  
    this.comentarioService.criarNovo(novoComentario).subscribe({
      next: () => {
        this.comentarios[postagemId] = {
          conteudo: '',
          usuario: this.usuario,
          postagem: this.postagemAtual!,
          dataComentario: ''
        };
        this.carregarRespostas(postagemId);
      },
      error: (err) => {
        console.error("Erro ao comentar:", err);
        alert("Erro ao enviar comentário.");
      }
    });
  }
  
  

  
  isComentando(post: Postagem): boolean {
    return !!this.comentando[post.id];
  }

  public carregarRespostas(postagemId: number): void {
    this.comentarioService.recuperarPorPostagemId(postagemId).subscribe({
      next: (comentarios) => {
        this.respostasPorPostagem[postagemId] = comentarios.map(comentario => ({
          ...comentario,
          midias: []
        }));
      },
      error: (err: any) => {
        console.error("Erro ao carregar respostas:", err);
      }
    });
  }

  expandirComentarios(post: Postagem) {

    this.modalAberto = true;
  }

  public abrirEmojiPicker() { }
  public selecionarGif() { }

  public preencherModal(post: Postagem): void {
    this.modalConteudo = post.conteudo;
    this.postagemAtual = post; // <<< salva o post inteiro
  
    if (!this.comentarios[post.id]) {
      this.comentarios[post.id] = {
        conteudo: '',
        usuario: this.usuario,
        postagem: post,
        dataComentario: ''
      };
    }
  
    const modal = document.getElementById('modalComentariosUpload');
    if (modal) {
      const onShown = () => {
        setTimeout(() => this.comentarioInput?.nativeElement.focus(), 50);
        modal.removeEventListener('shown.bs.modal', onShown);
      };
      modal.addEventListener('shown.bs.modal', onShown);
    }
  }
  
  
  


}
