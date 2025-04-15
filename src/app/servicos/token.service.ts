import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private router: Router) { }

  public getTokenHeader(): any {
    let token = localStorage.getItem("CrosstalkTK") || "";
    if (token == "") {
      this.router.navigate(['/']);
    }
    let header = {
      "Authorization": token
    }
    return header;
  }
}
