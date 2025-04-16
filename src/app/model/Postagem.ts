export class Postagem {
    id?: number;
    usuario!: {
      idUsuario: number;
      nomeUsuario: string;
      emailUsuario: string;
      avatar: string;
      status: string;
    };
    conteudo!: string;
    imagemUrl?: string;
    privacidade?: string;
    dataPostagem?: string;
  }
  