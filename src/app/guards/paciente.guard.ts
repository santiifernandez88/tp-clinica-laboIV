import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UserService } from '../services/user.service';

export const pacienteGuard: CanActivateFn = (route, state) => {
  const uService = inject(UserService)

  if(uService.paciente){
    console.log("es paciente.");
    return true;
  }

  console.error("Esta seccion no te corresponde!!.");
  return false;
};
