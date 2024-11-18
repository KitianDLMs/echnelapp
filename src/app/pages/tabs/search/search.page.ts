import { RestaurantService } from 'src/app/services/restaurant/restaurant.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Restaurant } from 'src/app/models/restaurant.model';
import { AddressService } from 'src/app/services/address/address.service';
// import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit, OnDestroy {

  @ViewChild('searchInput') sInput;
  model: any = {
    icon: 'search-outline',
    title: 'No se encontró ningún registro de restaurantes'
  };
  isLoading: boolean;
  query: any;
  restaurants: Restaurant[] = [];
  location: any = {};
  addressSub: Subscription;
  data: any;
  page = 1;

  constructor(
    private addressService: AddressService,
    private global: GlobalService,
    private restaurantService: RestaurantService
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.sInput.setFocus();
    }, 500);
    this.addressSub = this.addressService.addressChange.subscribe(address => {
      if(address && address?.lat) this.location = address;
      console.log(this.location);
    });
  }

  async onSearchChange(event) {
    console.log(event.detail.value);
    this.query = event.detail.value.toLowerCase();
    this.restaurants = [];
    if(this.query.length > 0) {
      this.isLoading = true;
      // setTimeout(async() => {
      //   this.restaurants = await this.allRestaurants.filter((element: any) => {
      //     return element.short_name.includes(this.query);
      //   });
      //   console.log(this.restaurants);
      //   this.isLoading = false;
      // }, 3000);
      try {
        if(this.location && this.location?.lat) {
          const radius = this.addressService.radius;
          const data = {
            lat: this.location.lat,
            lng: this.location.lng,
            radius,
            name: this.query
          };
          this.data = await this.restaurantService.searchNearbyRestaurants(data);
          console.log('restaurantes cercanos buscados: ', this.data);
          if(this.data) this.restaurants = this.restaurants.concat(this.data?.restaurants);
          console.log('restaurantes: ', this.restaurants);
        } else {
          this.global.errorToast('Por favor seleccione su ubicación para continuar con la búsqueda...');
        }
        this.isLoading = false;
      } catch(e) {
        this.isLoading = false;
        this.global.checkMessageForErrorToast(e);
        // let msg;
        // if(e?.error?.message) {
        //   msg = e.error.message;
        // }
        // this.global.errorToast(msg);
      }
    }
  }

  async loadMore(event) {
    console.log(event);
    try {
      this.page++;
      // call functionality within settimeout of 2 secs for showing loader properly
      setTimeout(async() => {
        const perPage = this.data.perPage;
        const nextPage = this.data.nextPage;
        if(nextPage) {
          const radius = this.addressService.radius;
          const data = {
            lat: this.location.lat,
            lng: this.location.lng,
            radius,
            name: this.query,
            page: this.page
          };
          this.data = await this.restaurantService.searchNearbyRestaurants(data);
          if(this.data) this.restaurants = this.restaurants.concat(this.data?.restaurants);
          console.log(this.data);
        }
        console.log(this.restaurants);
        event.target.complete();
        // if(this.data?.nextPage) event.target.disabled = true;
        if(this.data?.restaurants?.length < perPage) {
          this.global.infoToast('¡Ok! Todos los restaurantes obtenidos con éxito. No quedan más restaurantes...');
          event.target.disabled = true
        };
      }, 2000);
    } catch(e) {
      this.global.checkMessageForErrorToast(e);
      // let msg;
      // if(e?.error?.message) {
      //   msg = e.error.message;
      // }
      // this.global.errorToast(msg);
    }
  }

  ngOnDestroy() {
      if(this.addressSub) this.addressSub.unsubscribe();
  }

}
