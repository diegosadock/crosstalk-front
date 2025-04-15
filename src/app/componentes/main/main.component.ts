import { Component } from '@angular/core';
import { Usuario } from '../../model/Usuario';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  public usuario: Usuario = new Usuario();

}
