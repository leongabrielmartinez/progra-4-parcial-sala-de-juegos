import { MayorMenor } from './components/games/mayor-o-menor/mayor-o-menor';
import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { QuienSoy } from './components/quien-soy/quien-soy';
import { userExistGuard } from './guards/user-exist-guard';
import { userNotExistGuard } from './guards/user-not-exist-guard';
import { userIsAdminGuard } from './guards/user-is-admin-guard';

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
        path: 'resultados', 
        loadComponent: () => import('./components/resultados/resultados').then(m => m.Resultados),
        canActivate: [userNotExistGuard] 
    },
    { 
        path: 'encuesta', 
        loadComponent: () => import('./components/encuesta/encuesta').then(m => m.Encuesta),
        canActivate: [userNotExistGuard] 
    },
    {
        path: 'estadisticas',
        loadComponent: () => import('./components/estadisticas-admin/estadisticas-admin').then(m => m.EstadisticasAdmin),
        canActivate: [userIsAdminGuard] 
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
            {
                path: 'mayor-o-menor',
                loadComponent: () => import('./components/games/mayor-o-menor/mayor-o-menor').then(m => m.MayorMenor)
            },
            {
                path: 'preguntados',
                loadComponent: () => import('./components/games/preguntados/preguntados').then(m => m.Preguntados)
            },
            {
                path: 'intruso',
                loadComponent: () => import('./components/games/intruso/intruso').then(m => m.Intruso)
            },
        ]
    },


    { path: '**', redirectTo: 'home' }
];

