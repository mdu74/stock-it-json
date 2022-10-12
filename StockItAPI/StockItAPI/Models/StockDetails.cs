using System;
namespace StockItAPI.Models
{
    public class StockDetails
    {
        public int id { get; set; }
        public string? stock { get; set; }
        public string? industry { get; set; }
        public string? sector { get; set; }
        public string? currency_code { get; set; }
        public DateTime date { get; set; }
        public double value { get; set; }
    }
}

