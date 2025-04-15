import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { MainComponent } from './componentes/main/main.component';
import { ProfileComponent } from './componentes/profile/profile.component';

const routes: Routes = [
  { path: "", component: LoginComponent},
  { path: "main", component: MainComponent },
  { path: "profile/:idUsuario", component: ProfileComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
