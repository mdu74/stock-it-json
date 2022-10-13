import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { Stock } from '../interfaces/stock';
import { StockValue } from '../interfaces/stock-values';
import { StockRequest } from '../interfaces/stock-request';
import { StockDetails } from '../interfaces/stock-details';
import { StockDetailsRequest } from '../interfaces/stock-details-request';
import { ApiSettings } from 'src/global-constants/api-settings';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private stockValueCount$ = new BehaviorSubject<number>(0);

  constructor(private readonly http: HttpClient) { }

  updateStockValueCounter(length: number){
    this.stockValueCount$.next(length);
  }

  getResultLength(){
    return this.stockValueCount$.asObservable();
  }

  getAllStock(){
    return this.http.get<Stock[]>(`${ApiSettings.URL}/Stock/GetAll`)
                    .pipe(
                          map(res => res), 
                          catchError(this.handleError<Stock[]>("Get all stock ", []))
                        );
  }

  getSelectedStockDetails(stock: StockRequest){
    return this.http.post<StockDetails[]>(`${ApiSettings.URL}/Stock/GetSelectedDetails`, stock)
                    .pipe(
                          map(res => res), 
                          catchError(this.handleError<StockDetails[]>("Get selected details ", []))
                        );
  }

  createSelectedStockFile(stockDetailsRequest: StockDetailsRequest): Observable<boolean>{
    return this.http.post<boolean>(`${ApiSettings.URL}/Stock/CreateStockFile`, stockDetailsRequest)
                    .pipe(
                          map(res => res), 
                          catchError(this.handleError<boolean>("Create selected stock file ", false))
                        );
  }

  private handleError<T>(operation: string, result?: T) {
    return (error: any): Observable<T> => {
      console.error("Service error while ", operation, ": ", error);
      return of(result as T);
    };
  }
}
