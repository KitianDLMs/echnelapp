import { User } from './../../../models/user.model';
import { Subscription } from 'rxjs';
import { RazorpayService } from './../../../services/razorpay/razorpay.service';
import { ProfileService } from './../../../services/profile/profile.service';
import { OrderService } from 'src/app/services/order/order.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { Order } from 'src/app/models/order.model';
import { CartService } from 'src/app/services/cart/cart.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { loadMercadoPago } from "@mercadopago/sdk-js";
import { MercadoPagoService } from 'src/app/services/mercadopago/mercadopago.service';

@Component({
  selector: "app-payment-option",
  templateUrl: "./payment-option.page.html",
  styleUrls: ["./payment-option.page.scss"],
})
export class PaymentOptionPage implements OnInit {
  urlCheck: any;
  url: any;
  order = {} as Order;
  profile = {} as User;
  profileSub: Subscription;

  constructor(
    private router: Router,
    private cartService: CartService,
    private global: GlobalService,
    private orderService: OrderService,
    private profileService: ProfileService,
    private razorpay: RazorpayService,
    private mercadoPagoService: MercadoPagoService
  ) {}

  async ngOnInit() {
    await this.getData();
    this.profileSub = this.profileService.profile.subscribe((profile) => {
      console.log("profile: ", profile);
      this.profile = profile;
    });
  }

  async getData() {
    try {
      await this.checkUrl();
      await this.profileService.getProfile();
      const order = await this.cartService.getCartOrder();
      this.order = JSON.parse(order?.value);
      console.log("payment order", this.order);
    } catch (e) {
      console.log(e);
      this.global.errorToast();
    }
  }

  checkUrl() {
    let url: any = this.router.url.split("/");
    console.log("url: ", url);
    const spliced = url.splice(url.length - 2, 2); // /tabs/cart url.length - 1 - 1
    this.urlCheck = spliced[0];
    console.log("urlcheck: ", this.urlCheck);
    url.push(this.urlCheck);
    this.url = url;
    console.log(this.url);
  }

  getPreviousUrl() {
    return this.url.join("/");
  }

  async createPaymentMercadoPago() {    
    this.mercadoPagoService.createOrder().subscribe((response: any) => {
      console.log(response);
      window.location.href = response.init_point; // Redirigir a la página de MercadoPago
    });
  }

  async placeOrder(order) {
    try {
      this.global.showLoader();
      await this.orderService.placeOrder(order);
      // clear cart
      await this.cartService.clearCart();
      this.global.hideLoader();
      this.global.successToast("Su pedido se realizó con éxito");
      this.router.navigateByUrl("/tabs/account");
    } catch (e) {
      console.log(e);
      this.global.hideLoader();
      this.global.checkMessageForErrorToast(e);
      // let msg;
      // if(e?.error?.message) {
      //   msg = e.error.message;
      // }
      // this.global.errorToast(msg);
    }
  }

  placeCodOrder() {
    this.placeOrder(this.order);
  }

  async payWithRazorpay() {
    try {
      // create razorpay order to get the order id
      const razorpay_order = await this.razorpay.createRazorpayOrder(
        this.order.grandTotal
      );
      console.log("razorpay order: ", razorpay_order);
      const param = {
        email: this.profile.email,
        phone: this.profile.phone,
        amount: this.order.grandTotal * 100,
        order_id: razorpay_order.id, // required in live mode
      };
      const data: any = await this.razorpay.payWithRazorpay(param);
      console.log("razorpay data: ", data);
      // place order
      const order = {
        ...this.order,
        payment_mode: "Razorpay",
        payment_id: data.razorpay_payment_id,
      };
      await this.placeOrder(order);
    } catch (e) {
      console.log(e);
    }
  }
}
