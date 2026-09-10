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
    }
];