using System;
namespace StockItAPI.DTO
{
    public class StockValue
    {
        public int stock_id { get; set; }
        public DateTime date { get; set; }
        public double value { get; set; }
    }
}

