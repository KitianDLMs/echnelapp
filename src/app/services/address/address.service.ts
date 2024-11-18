import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Address } from 'src/app/models/address.model';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  radius = 20; // in km

  private _addresses = new BehaviorSubject<Address[]>([]);
  private _addressChange = new BehaviorSubject<Address>(null);

  get addresses() {
    return this._addresses.asObservable();
  }
  get addressChange() {
    return this._addressChange.asObservable();
  }

  constructor(private api: ApiService) { }

  async getAddresses(limit?, page?) {
    try {
      let addresses: Address[];
      let address_data: any;
      if(limit) {
        address_data = await this.api.get('address/getUserLimitedAddresses', { limit }).toPromise();
        addresses = address_data;
      } else {
        address_data = await this.api.get('address/userAddresses', page ? { page } : null).toPromise();
        addresses = address_data?.addresses;
      }
      if(page) {
        let appended_addresses: Address[] = this._addresses.value;
        appended_addresses = appended_addresses.concat(addresses);
        addresses = [...appended_addresses];
      }
      console.log(addresses);
      this._addresses.next(addresses);
      return address_data;
    } catch(e) {
      console.log(e);
      throw(e);
    }
  }

  async addAddress(param) {
    try {
      const address: Address = await this.api.post('address/create', param).toPromise();
      console.log('added address: ', address);
      const currentAddresses = this._addresses.value;
      // const data = new Address(
      //   param.id,
      //   param.user_id,
      //   param.title,
      //   param.address,
      //   param.landmark,
      //   param.house,
      //   param.lat,
      //   param.lng
      // );
      currentAddresses.push(address);
      this._addresses.next(currentAddresses);
      this._addressChange.next(address);
      return address;
    } catch(e) {
      throw(e);
    }
    
  }

  async updateAddress(id, param) {
    try {
      const address: Address = await this.api.put(`address/edit/${id}`, param).toPromise();
      console.log('updated address: ', address);
      let currentAddresses = this._addresses.value;
      const index = currentAddresses.findIndex(x => x._id == id);
      // const data = new Address(
      //   address._id,
      //   address.user_id,
      //   address.title,
      //   address.address,
      //   address.landmark,
      //   address.house,
      //   address.lat,
      //   address.lng
      // );
      currentAddresses[index] = address;
      this._addresses.next(currentAddresses);
      this._addressChange.next(address);
      return address;
    } catch(e) {
      throw(e);
    }
  }

  async deleteAddress(param: Address) {
    try {
      const response = await this.api.delete('address/delete/' + param._id).toPromise();
      console.log(response);
      let currentAddresses = this._addresses.value;
      currentAddresses = currentAddresses.filter(x => x._id != param._id);
      this._addresses.next(currentAddresses);
      return currentAddresses;
    } catch(e) {
      throw(e);
    }
  }

  changeAddress(address) {
    this._addressChange.next(address);
  }

  async checkExistAddress(location) {
    console.log('check exist address: ', location);
    let loc: Address = location;
    try {
      const address: Address = await this.api.get(
        'address/checkAddress', 
        { lat: location.lat, lng: location.lng }
      ).toPromise();
      console.log('check address from server: ', address);
      if(address) loc = address;
      console.log(loc);
      this.changeAddress(loc);
      return loc;
    } catch(e) {
      throw(e);
    }
  }
 
}
