import { Component } from '@angular/core';
import { AuthService } from 'src/app/shared/auth-service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  email: string = '';
  password: string = '';

  message: string = '';

  constructor(private auth: AuthService) { }

  register() {
    if(this.email == '') {
      this.message = 'E-mail obrigatório';
      return;

    }

    if(this.password == '') {
      this.message = 'Senha obrigatória';
      return;

    }

    this.auth.register(this.email, this.password);
    this.email = '';
    this.password = '';

  }

}
