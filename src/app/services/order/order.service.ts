import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
// import { map } from 'rxjs/operators';
import { Order } from 'src/app/models/order.model';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: "root",
})
export class OrderService {
  private _orders = new BehaviorSubject<Order[]>([]);
  userAddress: string;
  get orders() {
    return this._orders.asObservable();
  }

  constructor(private api: ApiService) {}

  async getAllOrders(page?) {
    try {
      const data: any = await this.api.get("order/allOrders").toPromise();
      if (data) {
        let orders: Order[] = data.orders.map((order: any) => {
          return { ...order, order: JSON.parse(order.order) };
        });
        if (page && page > 1) {
          let appended_orders: Order[] = this._orders.value;
          appended_orders = appended_orders.concat(orders);
          orders = [...appended_orders];
        }
        this._orders.next(orders);
      }
      return data;
    } catch (e) {
      throw e;
    }
  }

  async getPhoneUser(userId: string): Promise<any> {
    try {
      const profile: any = await this.api
        .get(`user/profile/${userId}`)
        .toPromise();
      console.log(profile);

      if (profile) {
        return profile;
      }

      throw new Error("Order not found");
    } catch (e) {
      console.error(`Error fetching order with ID: ${userId}`, e);
      throw e;
    }
  }

  async getOrders(page?) {
    try {
      const data: any = await this.api
        .get("order/userOrders", page ? { page } : null)
        .toPromise();
      if (data) {
        let orders: Order[] = data.orders.map((order: any) => {
          return { ...order, order: JSON.parse(order.order) };
        });
        if (page && page > 1) {
          let appended_orders: Order[] = this._orders.value;
          appended_orders = appended_orders.concat(orders);
          orders = [...appended_orders];
        }
        this._orders.next(orders);
      }
      return data;
    } catch (e) {
      throw e;
    }
  }

  async getOrderById(orderId: string): Promise<Order> {
    try {
      const order: any = await this.api
        .get(`order/ordersByStatus/${orderId}`)
        .toPromise();
      console.log(order.orders[0].user_id);

      if (order) {
        return order;
      }

      throw new Error("Order not found");
    } catch (e) {
      console.error(`Error fetching order with ID: ${orderId}`, e);
      throw e;
    }
  }

  async getAddressByUser(addressId: string): Promise<Order> {
    try {
      const address: any = await this.api
        .get(`address/${addressId}`)
        .toPromise();
      console.log(address);

      if (address) {
        return address;
      }

      throw new Error("Order not found");
    } catch (e) {
      console.error(`Error fetching order with ID: ${addressId}`, e);
      throw e;
    }
  }

  // async getAddressByUser(addressId: string): Promise<any> {
  //   try {
  //     const address: any = await this.api.get(`address/${addressId}`).subscribe(
  //       (res) => {
  //         this.userAddress = res;
  //         console.log(this.userAddress);
  //       },
  //       (err) => {
  //         console.error(err);
  //       }
  //     );
  //     // console.log(address);

  //     if (address) {
  //       return address;
  //     }

  //     throw new Error("address not found");
  //   } catch (e) {
  //     console.error(`Error fetching address with ID: ${addressId}`, e);
  //     throw e;
  //   }
  // }

  async placeOrder(param) {
    try {
      param = { ...param, order: JSON.stringify(param.order) };
      const order: Order = await this.api
        .post("order/create", param)
        .toPromise();
      console.log("latest order: ", param);
      let currentOrders: Order[] = [];
      // currentOrders.push(new Order(
      //   param.address,
      //   param.restaurant,
      //   param.restaurant_id,
      //   param.order,
      //   param.total,
      //   param.grandTotal,
      //   param.deliveryCharge,
      //   param.status,
      //   param.time,
      //   param.paid,
      //   param.id,
      //   param.user_id,
      //   param.instruction
      // ));
      currentOrders.push(order);
      console.log("latest order: ", currentOrders);
      currentOrders = currentOrders.concat(this._orders.value);
      console.log("orders: ", currentOrders);
      this._orders.next(currentOrders);
      return currentOrders;
    } catch (e) {
      throw e;
    }
  }

  // Método para cambiar el estado de la orden a 'En Camino'
  async updateOrderToEnRoute(orderId: string) {
    try {
      const updatedOrder: Order = await this.api
        .patch(`order/updateStatus/enroute/${orderId}`, {})
        .toPromise();
      return updatedOrder;
    } catch (e) {
      throw e;
    }
  }

  // Método para cambiar el estado de la orden a 'Entregado'
  async updateOrderToDelivered(orderId: string) {
    try {
      const updatedOrder: Order = await this.api
        .patch(`order/updateStatus/delivered/${orderId}`, {})
        .toPromise();
      return updatedOrder;
    } catch (e) {
      throw e;
    }
  }

  // Método para cancelar la orden
  async cancelOrder(orderId: string) {
    try {
      const canceledOrder: Order = await this.api
        .patch(`order/updateStatus/cancelled/${orderId}`, {})
        .toPromise();
      return canceledOrder;
    } catch (e) {
      throw e;
    }
  }

  // return this.api.delete(`/deleteOrder/${orderId}`);

  deleteOrder(orderId: string): Observable<any> {
    return this.api.delete(`order/deleteOrder/${orderId}`);
  }
}
