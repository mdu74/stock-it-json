import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
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
import Swal from 'sweetalert2';

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
  displayedStockValueColumns: string[] = ['stock', 'date', 'value'];
  dataStockValueSource!: MatTableDataSource<StockDetails>;
  request: StockRequest | undefined ;
  resultsLength = 0;
  header: string = 'No Stock Selected';

  @ViewChild(MatPaginator) stockPaginator!: MatPaginator;
  @ViewChild(MatSort) stockSort!: MatSort;
  
  private _stockStream = new ReplaySubject<Stock[]>();

  constructor(private readonly stockService: StockService, private readonly datepipe: DatePipe){}

  ngOnInit(){
    this.stockIsLoading = true;
    this.stockService.getAllStock().subscribe(response => {
      this.dataStockSource = new MatTableDataSource(response);
      this.dataStockSource.paginator = this.stockPaginator;
      this.dataStockSource.sort = this.stockSort;
      this.stockIsLoading = false;
    });

    this.dataStockValueSource = new MatTableDataSource(undefined);
  }

  applyStockFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataStockSource.filter = filterValue.trim().toLowerCase();

    if (this.dataStockSource.paginator) {
      this.dataStockSource.paginator.firstPage();
    }
  }

  applyStockValueFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataStockValueSource.filter = filterValue.trim().toLowerCase();

    if (this.dataStockValueSource.paginator) {
      this.dataStockValueSource.paginator.firstPage();
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

  clearTable() {
    this.dataStockValueSource.data = [];
    this.request = undefined;
    this._stockStream.next([]);
    this.header = 'No Stock Selected';
    this.stockSelection.clear();
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
    this.header = headerCollection.join(', ');
       
    this.stockService.getSelectedStockDetails(request).subscribe((response: StockDetails[]) => {
      this.dataStockValueSource = new MatTableDataSource(response);
      this.resultsLength = response.length;
      this._stockStream.next(this.stockSelection.selected);
      this.stockValueIsLoading = false;
    });
  }

  onExportJson(): void {
    const date = new Date();
    const currentDateTime = this.datepipe.transform(date, 'dd-MM-yyyy HH:mm:ss');
    const stockDetails: StockDetailsRequest = {
      fileName: `${this.header} ${currentDateTime}`,
      stockDetails: this.dataStockValueSource.data
    };

    this.stockService.createSelectedStockFile(stockDetails).subscribe(response => {
      if (response) {
        Swal.fire({  
          position: 'top-end',  
          icon: 'success',  
          title: `Your file has been saved as ${stockDetails.fileName}.`,  
          showConfirmButton: false,  
          timer: 3000  
        }); 
      }
    });
  }
}
