import { Component } from '@angular/core';
import { Usuario } from '../../model/Usuario';
import { LoginService } from '../../servicos/login.service';
import { CrosstalkToken } from '../../model/CrosstalkToken';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  public usuario: Usuario = new Usuario();
  public loading: boolean = false;
  public mensagem: string = "";
  public constructor(private route: Router, private service: LoginService) {

  }

  public logar() {
    this.loading = true;
    this.service.efetuarLogin(this.usuario).subscribe(
      {
        next: (res: CrosstalkToken) => {
          this.loading = false;
          localStorage.setItem("CrosstalkTK", res.token);
          localStorage.setItem("Usuario", JSON.stringify(res.usuario));
          this.route.navigate(['main']);
        },
        error: (err: any) => {
          this.mensagem = "Email/Senha inválidos";
          this.loading = false;
        }
      }
    );
  }
}
