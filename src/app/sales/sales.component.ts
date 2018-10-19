import { Component, OnInit } from '@angular/core';

import { sale } from '../sale';
import { saleService } from '../sale.service';
import { FormsModule, Validators, NgForm, NgModel } from '@angular/forms';
import { max } from 'rxjs/operators';
import { AlertsService } from 'angular-alert-module'

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class salesComponent implements OnInit {
  sales: sale[];

  constructor(private saleService: saleService) { }

  ngOnInit() {
    this.getsales();
  }

  getsales(): void {
    this.saleService.getsales()
    .subscribe(sales => this.sales = sales);
  }

  add(date: Date, typeOfsales: string, bookingText: string, amount: number): void {
    date = date;
    typeOfsales = typeOfsales;
    bookingText = bookingText;
    amount = amount;
    // if(!date|| typeOfsales == '' || bookingText == '' || !amount)
    // {
    //   alert.setMessa
    // }
    if (!date || !typeOfsales || !bookingText || !amount) { return; }
    this.saleService.addsale({date, typeOfsales, bookingText, amount} as sale)
      .subscribe(sale => {
        this.sales.push(sale);
      });
  }

  delete(sale: sale): void {
    this.sales = this.sales.filter(h => h !== sale);
    this.saleService.deletesale(sale).subscribe();
  }

  sortbydate(): void{
   this.sales.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  sortbyamount():void{
    this.sales.sort((a, b) => a.amount - b.amount)
  }

}
