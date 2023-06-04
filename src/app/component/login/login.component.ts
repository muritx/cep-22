import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  message: string = '';

  constructor(private router: Router, private auth: AuthService) { }

  login() {
    if(this.email == '') {
      this.message = 'E-mail obrigatório';
      return;

    }

    if(this.password == '') {
      this.message = 'Senha obrigatória';
      return;

    }

    this.auth.login(this.email, this.password);
    this.email = '';
    this.password = '';

  }

  register() {
    this.router.navigate(['/register']);

  }

}
