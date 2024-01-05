import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '',
        pathMatch: 'full'
    },
    {
        path: 'details/:id',
        loadComponent: () => import('./details/details.component').then(m => m.DetailsComponent)
         
    },
   

 
];
