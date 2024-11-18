import { Strings } from './../../enum/strings';
import { GlobalService } from './../../services/global/global.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Injectable } from '@angular/core';
import { CanLoad, Route, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {

  constructor(
    private router: Router,
    private auth: AuthService,
    private global: GlobalService
  ) {}

  async canLoad(
    route: Route): Promise<boolean> {
      const existingRole = route.data['role'];
      console.log(existingRole);
      try {
        const user = await this.auth.getUser();
        console.log(user);
        if(user) {
          if(user?.status != 'active') {
            this.auth.logout();
            // this.navigate(Strings.LOGIN);
            return false;
          }
          if(user?.type == existingRole) return true;
          else {
            this.redirect(user?.type);
            return false;
          }
        } else if(user == false) {
          this.showAlert(existingRole);
          return false;
        } else {
          this.navigate(Strings.LOGIN);
          return false;
        }
      } catch(e) {
        this.showAlert(existingRole, e?.error?.message);
        throw(e);
      }
  }

  navigate(url) {
    this.router.navigateByUrl(url, { replaceUrl: true });
    return false;
  }

  showAlert(role, msg?) {
    this.global.showAlert(
      msg
        ? msg
        : "Por favor verifique su conectividad a Internet e inténtelo nuevamente.",
      "Reintentar",
      [
        {
          text: "Cerrar sesión",
          handler: () => {
            this.auth.logout();
            // this.navigate(Strings.LOGIN);
            return false;
          },
        },
        {
          text: "Reintentar",
          handler: () => {
            this.redirect(role);
          },
        },
      ]
    );
  }

  redirect(role) {
    let url: string;
    if(role == Strings.USER_TYPE) url = Strings.TABS;
    else if(role == Strings.ADMIN_TYPE) url = Strings.ADMIN;
    else {
      this.auth.logout();
      // url = Strings.LOGIN;
      return false;
    }
    this.navigate(url);
    return false;
  }
}
