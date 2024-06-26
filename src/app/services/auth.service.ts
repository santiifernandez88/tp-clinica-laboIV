import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, onAuthStateChanged } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userActive : any;

  constructor(private auth: Auth, private router: Router) {}
  

  async Login(email : string, password : string){
    return await signInWithEmailAndPassword(this.auth, email, password)
  }

  async Register(email : string, password : string) { 
    const res = await createUserWithEmailAndPassword(this.auth, email, password);
    await sendEmailVerification(res.user);
    return res.user
  }

  getUser() {
    return this.userActive;
  }

  getUserEmail(){
    return this.userActive.email;
  }

  logout() {
    this.auth.signOut().then(() => {
      this.router.navigate(['login']);
      this.userActive = null;
    });
  }

  async resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(this.auth, email);
      return 'Email de restablecimiento de contraseña enviado';
    } catch (error) {
      throw new Error('Error al enviar el email de restablecimiento de contraseña');
    }
  }
}
