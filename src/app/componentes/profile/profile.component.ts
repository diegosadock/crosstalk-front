import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Usuario } from '../../model/Usuario';
import { UsuarioService } from '../../servicos/usuario.service';
import { Postagem } from '../../model/Postagem';
import { PostagemService } from '../../servicos/postagem.service';
import { AuthService } from '../../servicos/auth.service';
import { UploadService } from '../../servicos/upload.service';
import { PathToFile } from '../../model/PathToFile';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  usuario!: Usuario;
  usuarioLogado!: Usuario | null;
  postagens: Postagem[] = [];
  idUsuario!: number;

  mostrarModal: boolean = false;
  arquivoSelecionado: File | null = null;
  msgModal: string = "";

  constructor(
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private postagemService: PostagemService,
    private authService: AuthService,
    private uploadService: UploadService
  ) { }

  ngOnInit(): void {
    this.usuarioLogado = this.authService.getUsuario();

    this.route.paramMap.subscribe(params => {
      const id = params.get('idUsuario');
      if (id) {
        this.idUsuario = +id;
        this.carregarDadosDoUsuario(this.idUsuario);
        this.carregarPostagensDoUsuario(this.idUsuario);
      }
    });
  }

  private carregarDadosDoUsuario(id: number): void {
    this.usuarioService.getUsuarioPorId(id).subscribe({
      next: (user) => this.usuario = user,
      error: (err) => console.error('Erro ao carregar usuário:', err)
    });
  }

  private carregarPostagensDoUsuario(id: number): void {
    this.postagemService.listarPorUsuario(id).subscribe({
      next: (posts) => {
        this.postagens = posts.sort((a, b) => {
          const dataA = new Date(a.dataPostagem || 0).getTime();
          const dataB = new Date(b.dataPostagem || 0).getTime();
          return dataB - dataA;
        });
      },
      error: (err) => console.error('Erro ao carregar postagens:', err)
    });
  }

  abrirModalAvatar(): void {
    if (this.usuario.idUsuario === this.usuarioLogado?.idUsuario) {
      this.mostrarModal = true;
    }
  }

  fecharModal(): void {
    this.mostrarModal = false;
    this.arquivoSelecionado = null;
  }

  selecionarArquivo(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.arquivoSelecionado = input.files[0];
    }
  }

  enviarAvatar(): void {
    if (!this.arquivoSelecionado) {
      this.exibirModal("Nenhum arquivo selecionado.");
      return;
    }
  
    const tamanhoMaximo = 5 * 1024 * 1024;
    if (this.arquivoSelecionado.size > tamanhoMaximo) {
      this.exibirModal("O arquivo excede o tamanho máximo permitido (5MB).");
      return;
    }
  
    const tipoArquivo = this.arquivoSelecionado.type;
    if (!tipoArquivo.startsWith("image/")) {
      this.exibirModal("Por favor, envie um arquivo de imagem.");
      return;
    }
  
    const formData = new FormData();
    formData.append("arquivo", this.arquivoSelecionado, this.arquivoSelecionado.name);
  
    this.uploadService.uploadFile(formData).subscribe({
      next: (res: PathToFile) => {
        // Apenas o nome do arquivo salvo, como "avatar123.png"
        const nomeArquivo = res.path;
  
        // Montar a URL completa para exibir no frontend
        const novoCaminho = `/assets/media/${nomeArquivo}`;
        this.usuario.fotoPerfil = novoCaminho;
  
        // Atualizar apenas com o nome do arquivo (backend monta o caminho)
        this.usuarioService.atualizarCampoFoto(this.usuario.idUsuario, nomeArquivo).subscribe({
          next: () => {
            localStorage.setItem("Usuario", JSON.stringify(this.usuario));
            this.exibirModal("Foto de perfil atualizada!");
            this.fecharModal();
          },
          error: (err) => {
            this.exibirModal("Erro ao salvar nova foto no backend.");
            console.error("Erro ao salvar foto:", err);
          }
        });
      },
      error: (err) => {
        this.exibirModal("Erro ao enviar imagem.");
        console.error("Erro de upload:", err);
      }
    });
  }
  
  

  exibirModal(mensagem: string): void {
    this.msgModal = mensagem;
    document.getElementById("btnModalAlerta")?.click();
  }
}
