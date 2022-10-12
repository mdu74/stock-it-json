import { StockDetails } from "./stock-details";

export interface StockDetailsRequest {
    fileName: string;
    stockDetails: StockDetails[];
}