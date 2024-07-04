import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UserService } from '../services/user.service';

export const especialistaGuard: CanActivateFn = (route, state) => {
  const uService = inject(UserService)

  if(uService.especialista){
    console.log("es especialista.");
    return true;
  }

  console.error("Esta seccion no te corresponde!!.");
  return false;
};
