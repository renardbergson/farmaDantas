import { Component } from '@angular/core';
import {PurchaseHeader, PurchaseStatsCards, PurchaseSearchbar, PurchaseTable, PurchaseAddNewModal} from './components'

@Component({
  selector: 'app-purchases',
  imports: [PurchaseHeader, PurchaseStatsCards, PurchaseSearchbar, PurchaseTable, PurchaseAddNewModal],
  templateUrl: './purchases.html',
  styleUrl: './purchases.css',
})
export class Purchases {

}
