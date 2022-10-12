using System;
namespace StockItAPI.Models
{
    public class StockFileRequest
    {
        public string? FileName { get; set; }
        public List<StockDetails>? StockDetails { get; set; }
    }
}

