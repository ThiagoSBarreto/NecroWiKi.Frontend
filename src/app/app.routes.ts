import { Routes } from '@angular/router';

import { HomeComponent } from './home/home';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'register/:type',
        loadComponent: () => import('./components/register.component/register.component').then(m => m.RegisterComponent)
    },
    {
        path: 'arcade/:system',
        loadComponent: () => import('./components/arcade/gamesystem.component/gamesystem.component').then(m => m.GamesystemComponent)
    },
    {
        path: 'arcade/:system/play',
        loadComponent: () => import('./components/arcade/player.component/player.component').then(m => m.PlayerComponent)
    }
];