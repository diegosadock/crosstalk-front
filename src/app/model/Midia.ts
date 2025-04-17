import { Postagem } from "./Postagem";

export class Midia {
  numSeq?: number = 0;
  descricao: string = "";
  linkMidia: string = "";
  postagem?: Partial<Postagem>; // Associação opcional à postagem
}
