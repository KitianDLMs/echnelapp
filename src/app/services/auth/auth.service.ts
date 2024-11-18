import { Strings } from './../../enum/strings';
import { ApiService } from 'src/app/services/api/api.service';
import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ProfileService } from '../profile/profile.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _token = new BehaviorSubject<string>(null);
  private _refreshToken = new BehaviorSubject<string>(null);

  get token() {
    return this._token.asObservable();
  }

  get refreshToken() {
    return this._refreshToken.asObservable();
  }

  constructor(
    private router: Router,
    private storage: StorageService,
    private api: ApiService,
    private profile: ProfileService
  ) { }

  updateToken(value) {
    this._token.next(value);
  }

  updateRefreshToken(value) {
    this._refreshToken.next(value);
  }

  async login(email: string, password: string): Promise<any> {
    try {
      const data = {
        email,
        password
      };
      const response = await this.api.get('user/login', data).toPromise();
      console.log(response);
      this.setUserData(response?.token, response?.refreshToken);
      this.updateProfileData(response?.user);
      return response;
    } catch(e) {
      throw(e);
    }
  }

  async getToken() {
    let token: string = this._token.value;
    if(!token) {
      token = (await this.storage.getStorage(Strings.TOKEN)).value;
      this.updateToken(token);
    }
    await this.getRefreshToken();
    return token;
  }

  async getRefreshToken() {
    let refreshToken: string = this._refreshToken.value;
    if(!refreshToken) {
      refreshToken = (await this.storage.getStorage(Strings.REFRESH_TOKEN)).value;
      this.updateRefreshToken(refreshToken);
    }
    return refreshToken;
  }

  getNewTokens(): Observable<any> {
    const refreshToken = this._refreshToken.value;
    return this.api.post('user/refresh_token', { refreshToken }).pipe(
      tap(response => {
        this.setUserData(response?.accessToken, response?.refreshToken);
      })
    );
  }

  async getUser() {
    const token = await this.getToken();
    console.log(token);
    try {
      if(token) {
        const user = await this.profile.getProfile();
        console.log(user);
        if(user) return user;
        return false;
      }
      return null;
    } catch(e) {
      if(token) return false;
      return null;
    }
  }

  isLoggedIn() {
    return this.getToken();
  }

  async register(formValue) {
    try {
      const data = {
        name: formValue.name,
        email: formValue.email,
        phone: formValue.phone,
        type: Strings.USER_TYPE,
        status: 'active',
        password: formValue.password
      };
      const response = await this.api.post('user/signup', data).toPromise();
      console.log(response);
      this.setUserData(response?.token, response?.refreshToken);
      this.updateProfileData(response?.user);
      return response;
    } catch(e) {
      throw(e);
    }
  }

  async setUserData(token: string, refreshToken: string) {
    this.storage.setStorage(Strings.TOKEN, token);
    this.storage.setStorage(Strings.REFRESH_TOKEN, refreshToken);
    this.updateToken(token);
    this.updateRefreshToken(refreshToken);
  }

  updateProfileData(data) {
    this.profile.updateProfileData(data);
  }

  async sendResetPasswordOtp(email: string) {
    try {
      const data = { email };
      const response = await this.api.get('user/send/reset/password/token', data).toPromise();
      console.log(response);
      return response;
    } catch(e) {
      throw(e);
    }
  }

  async verifyResetPasswordOtp(email: string, otp: string) {
    try {
      const data = { 
        email,
        reset_password_token: otp 
      };
      const response = await this.api.get('user/verify/resetPasswordToken', data).toPromise();
      console.log(response);
      return response;
    } catch(e) {
      throw(e);
    }
  }

  async resetPassword(data) {
    try {
      const response = await this.api.patch('user/reset/password', data).toPromise();
      console.log(response);
      return response;
    } catch(e) {
      throw(e);
    }
  }

  logoutUser(nav?) {
    this.storage.removeStorage(Strings.TOKEN);
    this.storage.removeStorage(Strings.REFRESH_TOKEN);
    this._token.next(null);
    this._refreshToken.next(null);
    this.profile.updateProfileData(null);
    if(!nav) this.router.navigateByUrl(Strings.LOGIN, { replaceUrl: true });
  }

  async logout(nav?) {
    try {
      const refreshToken = await this.getRefreshToken();
      await this.api.post('user/logout', { refreshToken }).toPromise();
      this.logoutUser(nav);
    } catch(e) {
      console.log(e);
      throw(e);
    }
  }
  
}
