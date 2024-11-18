import { GlobalService } from 'src/app/services/global/global.service';
import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
// import { SplashScreen } from '@capacitor/splash-screen';
import { register } from 'swiper/element/bundle';
import { FcmService } from './services/fcm/fcm.service';

register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  
  constructor(
    private platform: Platform,
    private fcm: FcmService, 
    private global: GlobalService
  ) {
    this.platform.ready().then(() => {
      this.fcm.initPush();
    }).catch(e => {
      console.log(e);      
    })
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.global.customStatusbar();
      // SplashScreen.hide();
    })
  }
}
