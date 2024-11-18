import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Order } from 'src/app/models/order.model';
import { GlobalService } from 'src/app/services/global/global.service';
import { OrderService } from 'src/app/services/order/order.service';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { environment } from 'src/environments/environment';
import { Router } from "@angular/router";

@Component({
  selector: "app-orders",
  templateUrl: "./orders.page.html",
  styleUrls: ["./orders.page.scss"],
})
export class OrdersPage implements OnInit {
  serverUrl = environment.serverUrl;
  profile: any = {};
  isLoading: boolean;
  orders: Order[] = [];
  ordersSub: Subscription;
  profileSub: Subscription;
  verifyOtp = false;
  page = 1;
  data: any;

  constructor(
    private orderService: OrderService,
    public global: GlobalService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getData();
  }

  async getData() {
    try {
      this.isLoading = true;
      this.data = await this.orderService.getAllOrders();
      console.log("all orders: ", this.data);
      this.isLoading = false;
    } catch (e) {
      console.log(e);
      this.isLoading = false;
      this.global.checkMessageForErrorToast(e);
    }
  }

  // Actualiza el estado localmente
  // updateStatus(order: Order, newStatus: string) {
  //   order.status = newStatus;
  // }

  async updateStatus(order: Order, newStatus: string) {
    console.log(order._id);
    localStorage.setItem("orderId", order._id);
    try {
      this.isLoading = true;
      console.log(newStatus);
      // Llamadas al servicio según el nuevo estado de la orden
      if (newStatus === "en camino") {
        // Cambiar el estado a "En Camino"
        const updatedOrder = await this.orderService.updateOrderToEnRoute(
          order._id
        );
        console.log("Order updated to Enroute:", updatedOrder);
      } else if (newStatus === "entregado") {
        // Cambiar el estado a "Entregado"
        const updatedOrder = await this.orderService.updateOrderToDelivered(
          order._id
        );
        console.log("Order updated to Delivered:", updatedOrder);
      } else if (newStatus === "cancelado") {
        // Cancelar la orden
        const updatedOrder = await this.orderService.cancelOrder(order._id);
        console.log("Order Cancelled:", updatedOrder);
      }

      // Actualiza el estado localmente después de la llamada al backend
      order.status = newStatus;
      this.isLoading = false;
    } catch (e) {
      console.log("Error updating status:", e);
      this.isLoading = false;
      this.global.checkMessageForErrorToast(e);
    }
  }

  goToOrderDetail(orderId: string) {
    console.log(orderId);
    this.router.navigate(["/order-detail", orderId]);
  }

  async deleteOrder(orderId: string) {
    console.log(orderId);    
    this.orderService.deleteOrder(orderId).subscribe(
      (response) => {
        console.log("Order deleted successfully", response);
        this.getData();
      },
      (error) => {
        console.error("Error deleting order", error);
      }      
    );
  }
}
