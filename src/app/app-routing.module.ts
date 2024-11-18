import { Strings } from './enum/strings';
import { AutoLoginGuard } from './guards/auto-login/auto-login.guard';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'tabs',
    pathMatch: 'full'
  },
  {
    path: 'tabs',
    loadChildren: () => import('./pages/tabs/tabs.module').then( m => m.TabsPageModule),
    canLoad: [AuthGuard],
    data: {
      role: Strings.USER_TYPE
    }
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule),
    canLoad: [AutoLoginGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./pages/admin/admin.module').then( m => m.AdminPageModule),
    canLoad: [AuthGuard],
    data: {
      role: Strings.ADMIN_TYPE
    }
  },
  {
    path: 'restaurant',
    loadChildren: () => import('./pages/tabs/restaurant/restaurant-routing.module').then( m => m.RestaurantPageRoutingModule),
    data: {
      role: Strings.RESTAURANT_TYPE 
    }
  },
  // {
  //   path: 'restaurant',
  //   loadChildren: () => import('./pages/restaurant/restaurant.module').then( m => m.RestaurantPageModule)
  // },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
