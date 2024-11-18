import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class MercadoPagoService {
  private backendUrl = "http://localhost:3000";

  constructor(private http: HttpClient) {}

  createOrder() {
    return this.http.post(`${this.backendUrl}/create-order`, {});
  }
}
