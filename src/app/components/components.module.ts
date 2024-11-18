import { OtpScreenComponent } from './otp-screen/otp-screen.component';
import { OtpInputComponent } from './otp-input/otp-input.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantComponent } from './restaurant/restaurant.component';
import { IonicModule } from '@ionic/angular';
import { LoadingRestaurantComponent } from './loading-restaurant/loading-restaurant.component';
import { EmptyScreenComponent } from './empty-screen/empty-screen.component';
import { SearchLocationComponent } from './search-location/search-location.component';
import { NgOtpInputModule } from 'ng-otp-input';

const components = [
  RestaurantComponent,
  LoadingRestaurantComponent,
  EmptyScreenComponent,
  SearchLocationComponent,
  OtpInputComponent,
  OtpScreenComponent,
  OtpScreenComponent
];

@NgModule({
  declarations: [...components],
  imports: [
    CommonModule,
    IonicModule,
    NgOtpInputModule
  ],
  exports: [...components],
  // only those components not defined in template
  // entryComponents: [
  //   SearchLocationComponent
  // ]
})
export class ComponentsModule { }
