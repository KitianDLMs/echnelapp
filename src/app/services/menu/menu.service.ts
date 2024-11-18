import { Injectable } from '@angular/core';
import { Item } from 'src/app/models/item.model';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(
    private api: ApiService
  ) { }

  async addMenuItem(formData) {
    try {
      const data: Item = await this.api.post('item/create', formData, true).toPromise();
      return data;
    } catch(e) {
      throw(e);
    }
  }

  async getMenuItems(restaurantId) {
    try {
      const data: any = await this.api.get('item/menuItems/' + restaurantId).toPromise();
      return data;
    } catch(e) {
      throw(e);
    }
  }
}
