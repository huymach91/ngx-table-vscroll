import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'vscroll-directive-usage',
        loadComponent: () => import('./vscroll-directive-usage/vscroll-directive-usage.component').then(m => m.VscrollDirectiveUsageComponent)
    },
    {
        path: 'vscroll-component-usage',
        loadComponent: () => import('./vscroll-component-usage/vscroll-component-usage.component').then(m => m.VscrollComponentUsageComponent)
    }
];
