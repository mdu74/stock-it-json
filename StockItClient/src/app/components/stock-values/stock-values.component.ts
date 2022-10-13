import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, ReplaySubject } from 'rxjs';
import { Stock } from 'src/app/interfaces/stock';
import { StockDetails } from 'src/app/interfaces/stock-details';
import { StockDetailsRequest } from 'src/app/interfaces/stock-details-request';
import { StockService } from 'src/app/services/stock.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-stock-values',
  templateUrl: './stock-values.component.html',
  styleUrls: ['./stock-values.component.scss']
})
export class StockValuesComponent implements OnInit {
  @Input() header = '';
  @Input() selectedStockLength = 0;
  @Input() stockSelection = new SelectionModel<Stock>(true, []);
  @Input() _stockStream = new ReplaySubject<Stock[]>();
  @Input() dataStockValueSource = new MatTableDataSource<StockDetails>();
  
  resultsLength$: Observable<number>;  
  displayedStockValueColumns: string[] = ['stock', 'date', 'value'];
  stockValueIsLoading = false;

  constructor(private readonly stockService: StockService, private readonly datepipe: DatePipe) { 
    this.resultsLength$ = this.stockService.getResultLength();
  }

  ngOnInit(): void {
  }

  applyStockValueFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataStockValueSource.filter = filterValue.trim().toLowerCase();

    if (this.dataStockValueSource.paginator) {
      this.dataStockValueSource.paginator.firstPage();
    }
  }

  clearTable() {
    this.dataStockValueSource.data = [];
    this._stockStream.next([]);
    this.header = 'No Stock Selected';
    this.stockSelection.clear();
    this.stockService.updateStockValueCounter(0);
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
