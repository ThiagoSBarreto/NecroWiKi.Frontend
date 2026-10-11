import { Routes } from '@angular/router';

import { HomeComponent } from './home/home';
import { accountGuard, accountPageGuard, adminGuard, arcadeGuard } from './guards/auth.guards';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: HomeComponent,
        canActivate: [accountGuard]
    },
    {
        path: 'account',
        loadComponent: () => import('./account/account').then(m => m.AccountComponent),
        canActivate: [accountPageGuard]
    },
    {
        path: 'admin',
        loadComponent: () => import('./admin/admin').then(m => m.AdminComponent),
        canActivate: [accountGuard, adminGuard]
    },
    {
        path: 'tutorials',
        loadComponent: () => import('./tutorials/tutorials').then(m => m.TutorialsComponent),
        canActivate: [accountGuard]
    },
    {
        path: 'tutorials/:category/:slug',
        loadComponent: () => import('./tutorials/tutorials').then(m => m.TutorialsComponent),
        canActivate: [accountGuard]
    },
    {
        path: 'tutorials/:category',
        loadComponent: () => import('./tutorials/tutorials').then(m => m.TutorialsComponent),
        canActivate: [accountGuard]
    },
    {
        path: 'diablo2/tutorials',
        redirectTo: 'tutorials/diablo2'
    },
    {
        path: 'arcade/tutorials',
        redirectTo: 'tutorials/arcade'
    },
    {
        path: 'warcraft3/tutorials',
        redirectTo: 'tutorials/warcraft3'
    },
    {
        path: 'register/:type',
        loadComponent: () => import('./components/register.component/register.component').then(m => m.RegisterComponent),
        canActivate: [accountGuard]
    },
    {
        path: 'arcade/:system',
        loadComponent: () => import('./components/arcade/gamesystem.component/gamesystem.component').then(m => m.GamesystemComponent),
        canActivate: [arcadeGuard]
    },
    {
        path: 'arcade/:system/play',
        loadComponent: () => import('./components/arcade/player.component/player.component').then(m => m.PlayerComponent),
        canActivate: [arcadeGuard]
    },
    { path: '**', redirectTo: 'account' }
];