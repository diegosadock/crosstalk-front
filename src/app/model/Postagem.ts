import { Comentario } from "./Comentario";
import { Midia } from "./Midia";

export class Postagem {
    id: number = 0;
    usuario!: {
      idUsuario: number;
      nomeUsuario: string;
      emailUsuario: string;
      fotoPerfil: string;
      status: string;
    };
    midias: Midia[] = [];
    conteudo!: string;
    imagemUrl?: string
    privacidade?: string;
    dataPostagem?: string;
    comentarios?: Comentario[];

  }
  