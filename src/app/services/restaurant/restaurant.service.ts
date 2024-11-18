import { Injectable } from '@angular/core';
import { Restaurant } from 'src/app/models/restaurant.model';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {

  constructor(
    private api: ApiService
  ) { }

  async addRestaurant(formData) {
    try {
      const data: Restaurant = await this.api.post('restaurant/create', formData, true).toPromise();
      return data;
    } catch(e) {
      throw(e);
    }
  }

  async getRestaurants() {
    try {
      const restaurants: Restaurant[] = await this.api.get('restaurant/getRestaurants').toPromise();
      return restaurants;
    } catch(e) {
      throw(e);
    }
  }

  async getNearbyRestaurants(data: {lat: number, lng: number, radius: number, page?: number}) {
    try {
      const res_data: any = await this.api.get('restaurant/nearbyRestaurants', data).toPromise();
      return res_data;
    } catch(e) {
      throw(e);
    }
  }

  async searchNearbyRestaurants(data: {lat: number, lng: number, radius: number, name: string, page?: number}) {
    try {
      const restaurants_data: any = await this.api.get('restaurant/searchNearbyRestaurants', data).toPromise();
      return restaurants_data;
    } catch(e) {
      throw(e);
    }
  }
}
