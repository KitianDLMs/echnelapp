import { GlobalService } from 'src/app/services/global/global.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit, OnDestroy {

  constructor(
    public auth: AuthService,
    private global: GlobalService) { }

  ngOnInit() {
    this.global.customStatusbar(true);
  }

  ngOnDestroy(): void {
    this.global.customStatusbar();
  }

}
