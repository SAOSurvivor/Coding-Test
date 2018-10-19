import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { sale }         from '../sale';
import { saleService }  from '../sale.service';

@Component({
  selector: 'app-sale-detail',
  templateUrl: './sale-detail.component.html',
  styleUrls: [ './sale-detail.component.css' ]
})
export class saleDetailComponent implements OnInit {
  @Input() sale: sale;

  constructor(
    private route: ActivatedRoute,
    private saleService: saleService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getsale();
  }

  getsale(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.saleService.getsale(id)
      .subscribe(sale => this.sale = sale);
  }

  goBack(): void {
    this.location.back();
  }

 save(): void {
    this.saleService.updatesale(this.sale)
      .subscribe(() => this.goBack());
  }
}
