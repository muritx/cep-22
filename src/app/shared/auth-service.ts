import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  message: string = '';

  constructor(private fireAuth: AngularFireAuth, private router: Router) { }

  login(email: string, password: string) {
    this.fireAuth.signInWithEmailAndPassword(email, password)
    .then(() => {
      localStorage.setItem('token', 'true');
      this.router.navigate(['/dashboard']);

      console.log('Login realizado com sucesso');

    }, err => {
      this.message = err.message;
      this.router.navigate(['/login']);

      console.log(this.message);

    })

  }

  register(email: string, password: string) {
    this.fireAuth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      this.router.navigate(['/login']);

      console.log('Cadastro realizado com sucesso');

    }, err => {
      this.router.navigate(['/register']);
      this.message = err.message;

      console.log(this.message);
    })

  }

  logout() {
    this.fireAuth.signOut()
    .then(() => {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);

    }, err => {
      this.message = err.message;

      console.log(this.message);

    })

  }

}
