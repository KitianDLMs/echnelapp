import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GlobalService } from 'src/app/services/global/global.service';
import { ProfileService } from 'src/app/services/profile/profile.service';

@Component({
  selector: 'app-otp-screen',
  templateUrl: './otp-screen.component.html',
  styleUrls: ['./otp-screen.component.scss'],
})
export class OtpScreenComponent implements OnInit {

  @Input() sendOtp = false;
  otp: string;
  length: number;
  @Output() verified: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private global: GlobalService,
    private profile: ProfileService
  ) { }

  ngOnInit() {
    if(this.sendOtp) this.resend();
  }

  getOtpLength(length) {
    this.length = length;
  }

  onOtpChange(otp) {
    this.otp = otp;
    console.log(this.otp);
  }

  resend() {
    console.log('send otp again');
    this.global.showLoader();
    this.profile.resendOtp()
    .then(response => {
      console.log(response);
      this.global.hideLoader();
      if(response?.success) this.global.successToast('Se envía una OTP a su correo electrónico para verificación de correo electrónico');
    })
    .catch(e => {
      console.log(e);
      this.global.hideLoader();
      let msg = '¡Algo salió mal! Por favor inténtalo de nuevo.';
      this.global.checkErrorMessageForAlert(e, msg);
      // if(e?.error?.message) {
      //   msg = e.error.message;
      // }
      // this.global.showAlert(msg);
    });
  }

  verify() {
    if(this.otp?.length != this.length) return this.global.showAlert('Ingrese la OTP adecuada');
    this.global.showLoader();
    this.profile.verifyEmailOtp({ verification_token: this.otp })
    .then(response => {
      console.log(response);
      this.global.hideLoader();
      this.global.successToast('Su correo electrónico se verifica con éxito');
      this.verified.emit(true);
    })
    .catch(e => {
      console.log(e);
      this.global.hideLoader();
      let msg = 'Something went wrong! Please try again.';
      this.global.checkErrorMessageForAlert(e, msg);
      // if(e?.error?.message) {
      //   msg = e.error.message;
      // }
      // this.global.showAlert(msg);
    });
  }

}