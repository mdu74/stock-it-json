using System;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using StockItAPI.DTO;
using Newtonsoft.Json;
using StockItAPI.Models;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.Json.Serialization;

namespace StockItAPI.Services
{
    public class StockServices: IStockServices
    {
        private static readonly JsonSerializerOptions _option = new() { DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull };

        public async Task<List<Stock>> getAllStocks()
        {
            using (StreamReader reader = new StreamReader("./JsonData/Stocks.json"))
            {
                var stockJson = await reader.ReadToEndAsync();
                var stocks = JsonConvert.DeserializeObject<List<Stock>>(stockJson);
                return stocks != null ? stocks : new List<Stock>();
            }
        }

        public async Task<List<StockValue>> getStockValues()
        {
            using (StreamReader reader = new StreamReader("./JsonData/Stock Values.json"))
            {
                string stockValuesJson = await reader.ReadToEndAsync();
                var stockValues = JsonConvert.DeserializeObject<List<StockValue>>(stockValuesJson);
                return stockValues != null ? stockValues : new List<StockValue>();
            }
        }

        public async Task<Boolean> saveSelectedStock(StockFileRequest stockFileRequest)
        {
            await using var fileStream = File.Create($"./JsonData/{stockFileRequest.FileName}.json");
            await using var utf8JsonWriter = new Utf8JsonWriter(fileStream);

            await System.Text.Json.JsonSerializer.SerializeAsync(fileStream, stockFileRequest.StockDetails, _option);
            return true;
        }
    }
}

