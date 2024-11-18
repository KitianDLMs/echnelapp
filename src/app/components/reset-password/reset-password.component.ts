import { NgForm } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {

  @Input() model;
  otp: string;
  length: number;
  flag: number;
  @Output() check_email: EventEmitter<any> = new EventEmitter();
  @Output() verify_otp: EventEmitter<any> = new EventEmitter();
  @Output() set_password: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {}
  
  getOtpLength(length) {
    this.length = length;
  }

  onOtpChange(otp) {
    this.otp = otp;
    console.log(this.otp);
  }

  getData() {
    let data: any = {};
    if(this.model?.email == '' && this.model?.otp == '') {
      data = {
        title: 'Has olvidado tu contraseña', 
        subTitle: 'Ingresa tu correo electrónico para el proceso de verificación, te enviaremos un código de verificación a tu correo electrónico.', 
        button: 'ENVIAR OTP'
      };
      this.otp = '';
      this.flag = 1;
    } else if(this.model?.email != '' && this.model?.otp == '') {
      data = {title: 'Verifica tu correo electrónico', subTitle: 'Ingresa el código de verificación enviado a tu correo electrónico.', button: 'VERIFY'};
      this.flag = 2;
    } else {
      data = {
        title: 'Restablecer contraseña', 
        subTitle: 'Ingrese su nueva contraseña, debe tener al menos 8 caracteres.', 
        button: 'ENVIAR'
      };
      this.flag = 3;
    }
    console.log(data);
    return data;
  }

  onSubmit(form: NgForm) {
    console.log(form);
    if(!form.valid) return;
    if(this.flag == 1) this.check_email.emit(form.value.email);
    else if(this.flag == 2) this.verify_otp.emit(this.otp);
    else this.set_password.emit(form.value.new_password);
  }

}
