using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json.Linq;
using StockItAPI.DTO;
using StockItAPI.Models;
using StockItAPI.Services;

namespace StockItAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class StockController : ControllerBase
{
    private readonly IStockServices _stockServices;

    public StockController(IStockServices stockServices)
    {
        _stockServices = stockServices;
    }

    [HttpGet]
    [Route("/Stock/GetAll")]
    public async Task<ActionResult<List<Stock>>> GetAllStock()
    {
        var stocks = await _stockServices.getAllStocks();

        return Ok(stocks);
    }

    [HttpPost]
    [Route("/Stock/GetSelectedDetails")]
    public async Task<ActionResult<List<StockDetails>>> GetSelectedStockDetails(StockValuesRequest? request)
    {
        var stocks = await _stockServices.getAllStocks();
        var stockValuesResult = await _stockServices.getStockValues();
        var stockValues = stockValuesResult.OrderBy(value => value.stock_id);

        var svResult = from sv in stockValues
                     join s in stocks on sv.stock_id equals s.id into g
                     select new StockDetails
                     {
                         id = sv.stock_id,
                         industry = g.Any() ? g.First().industry : string.Empty,
                         sector = g.Any() ? g.First().sector : string.Empty,
                         stock = g.Any() ? g.First().stock : string.Empty,
                         currency_code = g.Any() ? g.First().currency_code : string.Empty,
                         date = sv.date,
                         value = sv.value,
                     };

        var ids = request != null ? request.ids : new List<int>();
        var selectedStockValues = svResult.Where(stock => ids.Contains(stock.id)).ToList();

        return Ok(selectedStockValues);
    }

    [HttpPost]
    [Route("/Stock/CreateStockFile")]
    public async Task<ActionResult<List<StockDetails>>> CreateStockFile(StockFileRequest request)
    {        
        try
        {
            if (request == null) throw new ArgumentException("Should have stock selected.");
            var result = await _stockServices.saveSelectedStock(request);

            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, "Could not create json file");
        }
    }
}
