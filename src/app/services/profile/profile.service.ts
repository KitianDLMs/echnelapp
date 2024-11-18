import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private _profile = new BehaviorSubject<User>(null);

  get profile() {
    return this._profile.asObservable();
  }

  constructor(
    private api: ApiService
  ) { }

  async getProfile() {
    try {
      const profile_data = this._profile.value;
      if(!profile_data) {
        const profile: User = await this.api.get('user/profile').toPromise();
        console.log('profile data: ', profile);
        // const data = new User(
        //   profile?.email,
        //   profile?.phone,
        //   profile?.name,
        //   profile?._id,
        //   profile?.type,
        //   profile?.status,
        //   profile?.email_verified
        // );
        return this.updateProfileData(profile);
      } else return profile_data;
    } catch(e) {
      console.log(e);
      throw(e);
    }
  }

  async updatePhoneNumber(phone) {
    try {
      const profile: User = await this.api.patch('user/update/phone', { phone }).toPromise();
      console.log('profile data: ', profile);
      // const data = new User(
      //   profile.email,
      //   profile.phone,
      //   profile.name,
      //   profile._id,
      //   profile.type,
      //   profile.status,
      //   profile.email_verified
      // );
      this.updateProfileData(profile);
      return profile;
    } catch(e) {
      console.log(e);
      throw(e);
    }
  }

  async updateProfile(param) {
    try {
      const profile_data = await this.api.patch('user/update/profile', {...param}).toPromise();
      const profile: User = profile_data?.user;
      console.log('profile data: ', profile);
      this.updateProfileData(profile);
      return profile_data;
    } catch(e) {
      console.log(e);
      throw(e);
    }
  }

  async updateProfilePic(formData) {
    try {
      const profile_data = await this.api.put('user/update/profilePic', formData, true).toPromise();
      const profile: User = profile_data;
      console.log('profile data: ', profile);
      this.updateProfileData(profile);
      return profile_data;
    } catch(e) {
      console.log(e);
      throw(e);
    }
  }



  async resendOtp() {
    try {
      const response = await this.api.get('user/send/verification/email').toPromise();
      return response;
    } catch(e) {
      throw(e);
    };
  }

  async verifyEmailOtp(data) {
    try {
      const response = await this.api.patch('user/verify/emailToken', data).toPromise();
      let profile_data: User = this._profile.value;
      if(profile_data) {
        profile_data = { ...profile_data, email_verified: true };
        this.updateProfileData(profile_data);
      }
      return response;
    } catch(e) {
      throw(e);
    }
  }

  updateProfileData(profile) {
    let data: any;
    if(profile) {
      data = new User(
        profile?.email,
        profile?.phone,
        profile?.name,
        profile?.type,
        profile?.status,
        profile?.email_verified,
        profile?.photo,
        // profile?._id,
      );
    } else data = profile;
    console.log(data);
    this._profile.next(data);
    return data;
  }
}
