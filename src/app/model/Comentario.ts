import { Postagem } from "./Postagem"
import { Usuario } from "./Usuario"

export interface Comentario {
    postagem: Postagem
    usuario: Usuario
    conteudo: string
    dataComentario: string
  }