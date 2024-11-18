import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { OrderService } from "src/app/services/order/order.service";

@Component({
  selector: "app-order-detail",
  templateUrl: "./order-detail.page.html",
  styleUrls: ["./order-detail.page.scss"],
})
export class OrderDetailPage implements OnInit {
  orderId: string | null = null;
  orderDetail: any = null;
  isLoading: boolean = true;
  address: any;
  userIdStorage: any;
  details: any;
  profile: any;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    this.orderId = this.route.snapshot.paramMap.get("id");
    if (this.orderId) {
      console.log(this.orderId);
      this.details = this.loadOrderDetail(this.orderId);
      console.log(this.details);
    }
  }

  async loadOrderDetail(id: string) {
    try {
      this.orderDetail = await this.orderService.getOrderById(id);
      this.details = this.orderDetail.orders;

      this.userIdStorage = localStorage.setItem(
        "address",
        this.details[0].user_id
      );
      this.userIdStorage = localStorage.getItem("address");

      this.address = this.getAddressByUser(this.userIdStorage);
      this.profile = this.getPhoneUser(this.userIdStorage);
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      this.isLoading = false;
    }
  }

  async getAddressByUser(addressUserId: string) {
    try {
      this.address = await this.orderService
        .getAddressByUser(addressUserId)
        .then();
      console.log(this.address);
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      this.isLoading = false;
    }
  }

  async getPhoneUser(userId) {
    this.profile = await this.orderService.getPhoneUser(userId).then();
    console.log(this.profile);
    console.log(this.address);
  }

  deleteOrder(orderId: string) {
    console.log("Eliminar orden con ID:", orderId);
    // this.orderService.deleteOrder(orderId).subscribe(
    //   (response) => {
    //     console.log("Orden eliminada exitosamente:", response);
    //     this.loadOrderDetails(); // Recargar los detalles o redirigir
    //   },
    //   (error) => {
    //     console.error("Error al eliminar la orden:", error);
    //   }
    // );
  }
}
