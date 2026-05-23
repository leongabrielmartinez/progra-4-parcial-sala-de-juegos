import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { QuienSoy } from './components/quien-soy/quien-soy';
import { userExistGuard } from './guards/user-exist-guard';
import { userNotExistGuard } from './guards/user-not-exist-guard';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },

    { path: 'home', component: Home },
    { path: 'quien-soy', component: QuienSoy },
    { 
        path: 'login', 
        loadComponent: () => import('./components/login/login').then(m => m.Login),
        canActivate: [userExistGuard]
    },

    { 
        path: 'registro', 
        loadComponent: () => import('./components/registro/registro').then(m => m.Registro),
        canActivate: [userExistGuard] 
    },
    {
        path: 'games',
        canActivate: [userNotExistGuard], 
        children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' }, 
            
            {
                path: 'ahorcado',
                loadComponent: () => import('./components/games/ahorcado/ahorcado').then(m => m.Ahorcado)
            },
        ]
    },


    { path: '**', redirectTo: 'home' }
];

