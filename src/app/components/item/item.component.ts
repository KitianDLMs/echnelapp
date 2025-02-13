import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Item } from 'src/app/models/item.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
})
export class ItemComponent implements OnInit {

  @Input() item: Item;
  @Input() index;
  @Output() add: EventEmitter<Item> = new EventEmitter();
  @Output() minus: EventEmitter<Item> = new EventEmitter();
  serverImageUrl = environment.serverUrl;

  constructor() { }

  ngOnInit() {}

  quantityPlus() {
    this.add.emit(this.item);
  }

  quantityMinus() {
    this.minus.emit(this.item);
  }

}
