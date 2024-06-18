import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const logueadoGuard: CanActivateFn = (route, state) => {
  
  const auth = inject(AuthService);

  if(auth.getUser()){
    console.log("puede pasar");
    return true
  }

  console.log("no puede pasar")
  return false;
};
