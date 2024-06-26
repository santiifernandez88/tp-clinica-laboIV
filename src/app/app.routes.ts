import { Routes } from '@angular/router';
import { logueadoGuard } from './guards/logueado.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/bienvenida', pathMatch: "full" },
    { path: 'bienvenida',
      loadComponent: () => 
        import('./componentes/bienvenida/bienvenida.component').then(
            (c) => c.BienvenidaComponent
        ),
      title: 'Bienvenido'
    },
    { path: 'login',
        loadComponent: () => 
          import('./componentes/login/login.component').then(
              (c) => c.LoginComponent
          ),
        title: 'Login'
    },
    { path: 'registroEspecialista',
      loadComponent: () => 
        import('./componentes/registers/registro-especialista/registro-especialista.component').then(
            (c) => c.RegistroEspecialistaComponent
        ),
      title: 'Registro Especialista'
    },
    { path: 'registroPaciente',
      loadComponent: () => 
        import('./componentes/registers/registro-paciente/registro-paciente.component').then(
            (c) => c.RegistroPacienteComponent
        ),
      title: 'Registro Paciente'
    },
    { path: 'usuarios',
      loadComponent: () => 
        import('./componentes/admin/admin.component').then(
            (c) => c.AdminComponent
        ),
      title: 'Usuarios',
      canActivate: [adminGuard]
    },
    { path: 'home',
      loadComponent: () => 
        import('./componentes/home/home.component').then(
            (c) => c.HomeComponent
        ),
      title: 'Home',
      canActivate: [logueadoGuard]
    },
];
