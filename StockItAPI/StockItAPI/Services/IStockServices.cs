using Newtonsoft.Json.Linq;
using StockItAPI.DTO;
using StockItAPI.Models;

namespace StockItAPI.Services
{
    public interface IStockServices
    {
        Task<List<Stock>> getAllStocks();
        Task<List<StockValue>> getStockValues();
        Task<Boolean> saveSelectedStock(StockFileRequest stockFileRequest);
    }
}