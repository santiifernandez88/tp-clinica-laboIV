import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UserService } from '../services/user.service';

export const adminGuard: CanActivateFn = (route, state) => {
    const uService = inject(UserService)

    if(uService.admin){
      console.log("es admin.");
      return true;
    }

    console.error("Esta seccion no te corresponde!!.");
    return false;
};
