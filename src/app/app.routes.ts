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
        path: 'arcade/n64',
        loadComponent: () => import('./components/arcade/n64.component/n64.component').then(m => m.N64LibraryComponent)
    }
];