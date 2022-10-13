import { Component, OnInit, ViewChild } from '@angular/core';
import { Stock } from './interfaces/stock';
import { StockService } from './services/stock.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { StockRequest } from './interfaces/stock-request';
import { StockDetails } from './interfaces/stock-details';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';
import { StockDetailsRequest } from './interfaces/stock-details-request';
import { DatePipe } from '@angular/common';
import { Subject } from 'rxjs/internal/Subject';
import { map } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  stockIsLoading = false;
  stockValueIsLoading = false;
  title = 'Stock It';
  stockSelection = new SelectionModel<Stock>(true, []);
  displayedStockColumns: string[] = ['select', 'id', 'stock', 'industry', 'currency_code', 'sector'];
  dataStockSource!: MatTableDataSource<Stock>;
  dataStockValueSource!: MatTableDataSource<StockDetails>;
  resultsLength$ = new Subject<number>();
  selectedHeader: string = 'No Stock Selected';

  @ViewChild(MatPaginator) stockPaginator!: MatPaginator;
  @ViewChild(MatSort) stockSort!: MatSort;
  
  _stockStream = new ReplaySubject<Stock[]>();

  constructor(private readonly stockService: StockService, private readonly datepipe: DatePipe){}

  ngOnInit(){
    this.stockIsLoading = true;
    this.stockService.getAllStock().subscribe(response => {
      this.dataStockSource = new MatTableDataSource(response);
      this.dataStockSource.paginator = this.stockPaginator;
      this.dataStockSource.sort = this.stockSort;
      this.stockIsLoading = false;
    });

  }

  applyStockFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataStockSource.filter = filterValue.trim().toLowerCase();

    if (this.dataStockSource.paginator) {
      this.dataStockSource.paginator.firstPage();
    }
  }

  isAllStockSelected() {
    const numSelected = this.stockSelection.selected.length;
    const numRows = this.dataStockSource ? this.dataStockSource.data.length : 0;
    return numSelected === numRows;
  }

  toggleAllStockRows() {
    if (this.isAllStockSelected()) {
      this.stockSelection.clear();
      return;
    }

    this.stockSelection.select(...this.dataStockSource.data);
  }

  checkboxLabel(row?: Stock): string {
    if (!row) {
      return `${this.isAllStockSelected() ? 'deselect' : 'select'} all`;
    }
    
    return `${this.stockSelection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  addData() {
    this.stockValueIsLoading = true;
    let request: StockRequest = {
      ids: []
    }

    let stockCollection: string[] = [];
    this.stockSelection.selected.forEach(stock => {
      stockCollection.push(stock.stock);
      request.ids.push(stock.id);
    });
    const headerCollection = Array.from(new Set(stockCollection));
    this.selectedHeader = headerCollection.join(', ');
       
    this.stockService.getSelectedStockDetails(request)
      .pipe(map(response => {
        this.stockService.updateStockValueCounter(response.length);
        return response;
      }))
      .subscribe((response: StockDetails[]) => {
      this.dataStockValueSource = new MatTableDataSource(response);
      this.resultsLength$.next(response.length);
      this._stockStream.next(this.stockSelection.selected);
      this.stockValueIsLoading = false;
    });
  }
}
