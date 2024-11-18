import { Strings } from './../../enum/strings';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OtpGuard implements CanActivate {

  constructor(
    private router: Router,
    private profile: ProfileService
  ) {}

  canActivate() {
    return this.profile.profile.pipe(
      take(1),
      map(user => {
        console.log('otp guard user: ', user);
        if(user?.email_verified) {
          return this.router.parseUrl(Strings.TABS);
        }
        return true;
      })
    );
  }
  
}
