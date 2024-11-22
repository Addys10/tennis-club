import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from '@features/dashboard/dashboard.component';
import {AuthGuard} from '@core/auth.guard';

const routes: Routes = [
  // Veřejné routy
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },

  // Chráněné routy (potřebují přihlášení)
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'trainings',
    loadChildren: () => import('./features/trainings/trainings.module')
      .then(m => m.TrainingsModule),
    canActivate: [AuthGuard]  // přidaný AuthGuard
  },

  // Default routa
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },

  // Volitelně můžeme přidat i wildcard routu pro 404
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
