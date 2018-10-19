import { InMemoryDbService } from 'angular-in-memory-web-api';
import { sale } from './sale';

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    console.log('called');
    
    // write code for loading data from json file
    const sales = [
      { id: 0, date: new Date("July 21, 2005 01:15:00"), typeOfsales: 'Automobile', bookingText: 'Prebooked', amount: 13902 },
      { id: 1, date: new Date("June 22, 2002 01:15:00"), typeOfsales: 'Food', bookingText: 'Paid in Advance', amount: 14 },
      { id: 2, date: new Date("May 10, 2009 01:15:00"), typeOfsales: 'Rations', bookingText: 'Unpaid', amount: 50 },
      { id: 3, date: new Date("March 11, 1983 01:15:00"), typeOfsales: 'Food', bookingText: 'Payment in Process', amount: 20 },
      { id: 4, date: new Date("July 01, 1999 01:15:00"), typeOfsales: 'House', bookingText: 'Unpaid', amount: 500000 }
    ];

    console.log(sales);
    return {sales};
  }
  /*
  saveDb() {
    // 
    return true;
  }
  */
  // Overrides the genId method to ensure that a sale always has an id.
  // If the sales array is empty,
  // the method below returns the initial number (11).
  // if the sales array is not empty, the method below returns the highest
  // sale id + 1.
  genId(sales: sale[]): number {
    return sales.length > 0 ? Math.max(...sales.map(sale => sale.id)) + 1 : 0;
  }
}
