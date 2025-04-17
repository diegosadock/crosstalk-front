export class Usuario {
    idUsuario: number = 0;
    nomeUsuario: string = "";
    emailUsuario: string = "";
    senhaUsuario: string = "";
    fotoPerfil: string = "";  // Foto de perfil, que pode vir do backend
    dataCadastro: string = ""; // Data de cadastro, pode vir como string em formato 'yyyy-MM-dd'
    bio: string = "";  // Bio do usuário
    cidade: string = "";  // Cidade do usuário
    dataNascimento: string = ""; // Data de nascimento do usuário, também como string
    status: string = "ativo"; // Status do usuário, pode ser "ativo", "inativo", etc.
}
