import { ApiService } from 'src/app/services/api/api.service';
import { Injectable } from '@angular/core';
import { Banner } from 'src/app/interfaces/banner.interface';

@Injectable({
  providedIn: 'root'
})
export class BannerService {

  constructor(
    private api: ApiService
  ) { }

  async addBanner(formData) {
    try {
      const data: Banner = await this.api.post('banner/create', formData, true).toPromise();
      return data;
    } catch(e) {
      throw(e);
    }
  }

  async getBanners() {
    try {
      const data: Banner[] = await this.api.get('banner/banners').toPromise();
      return data;
    } catch(e) {
      throw(e);
    }
  }
}
