import { Category } from 'src/app/models/category.model';
import { ApiService } from 'src/app/services/api/api.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    private api: ApiService
  ) { }

  async getRestaurantCategories(restaurant_id) {
    try {
      const categories: Category[] = await this.api.get('category/getCategories/' + restaurant_id).toPromise();
      return categories;
    } catch(e) {
      throw(e);
    }
  }
}
