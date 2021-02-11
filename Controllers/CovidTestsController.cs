using CovidApi.Hubs;
using CovidApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Unosquare.Tubular;

namespace CovidApi.Controllers
{
    public class UpdateChartDataRequest
    {
        public string ClientId { get; set; }

        public string ChartType { get; set; }
    }

    //todo: add authorization to access web api methods
    [Route("api/[controller]")]
    [ApiController]
    public class CovidTestsController : ControllerBase
    {
        private readonly CovidTestDatabaseContext _context;
        private readonly IHubContext<ChartHub> _chartHub;

        public CovidTestsController(CovidTestDatabaseContext context, IHubContext<ChartHub> chartHub)
        {
            _context = context;
            _chartHub = chartHub;
        }

        /// <summary>
        /// Get data paginated
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CovidTest>>> GetTestsPaged(int page, int size)
        {
            return await _context.Tests
                .OrderBy(x => x.Id)
                .Skip(page * size)
                .Take(size)
                .ToListAsync();
        }

        /// <summary>
        /// Get total count of data
        /// </summary>
        /// <returns></returns>
        [HttpGet("Count")]
        public ActionResult<int> GetTestCount()
        {
            return _context.Tests.Count();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CovidTest>> GetTest(int id)
        {
            var test = await _context.Tests.FindAsync(id);

            if (test == null)
            {
                return NotFound();
            }

            return test;
        }

        /// <summary>
        /// Get grouped data for chart
        /// </summary>
        //todo: if performance is very important, table(s) can be created that would hold aggregated info
        //todo: for now fast enough
        [HttpGet("Grouped/{columnToGroupBy}")]
        public async Task<ActionResult<Dictionary<string, int>>> GetTestsGrouped(string columnToGroupBy)
        {
            switch (columnToGroupBy)
            {
                case "Gender":
                    return await GetTestsGroupedByGender();

                case "Age":
                    return await GetTestsGroupedByAge();

                case "Municipality":
                    return await GetTestsGroupedByMunicipality();

                default:
                    return await GetTestsGroupedByDate();
            }
        }

        /// <summary>
        /// Add new Covid Test
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<CovidTest>> PostTest(CovidTest covidTest)
        {
            //todo: more validation
            if (covidTest.CaseCode == null || covidTest.CaseCode.Length != 64)
            {
                return BadRequest(new { message = "Please check your input.." });
            }

            covidTest.Id = GetTestCount().Value + 1;
            covidTest.SetAllStringNullPropertiesToStringEmpty();

            await _context.Tests.AddAsync(covidTest);
            await _context.SaveChangesAsync();

            await UpdateChartDataForAllClients();

            return CreatedAtAction(nameof(GetTest), new { id = covidTest.Id }, covidTest);
        }

        /// <summary>
        /// Used by Tubular package
        /// </summary>
        [HttpPost("GridData")]
        public IActionResult GridData([FromBody] GridDataRequest request)
        {
            return Ok(request.CreateGridDataResponse(_context.Tests));
        }

        [HttpPost("UpdateChartData")]
        public async Task<IActionResult> UpdateChartDataForSpecificClient(UpdateChartDataRequest messagePost)
        {
            var data = await GetTestsGrouped(messagePost.ChartType);
            var clients = new List<string> { messagePost.ClientId };

            await _chartHub.Clients.Clients(clients).SendAsync($"ChartDataBy{messagePost.ChartType}", data);

            return Ok();
        }

        /// <summary>
        /// Called when data is updated in DB
        /// Realtime chart functionality
        /// </summary>
        private async Task<IActionResult> UpdateChartDataForAllClients()
        {
            await _chartHub.Clients.All.SendAsync("ChartDataByDate", await GetTestsGrouped("Date"));
            await _chartHub.Clients.All.SendAsync("ChartDataByMunicipality", await GetTestsGrouped("Municipality"));
            await _chartHub.Clients.All.SendAsync("ChartDataByGender", await GetTestsGrouped("Gender"));
            await _chartHub.Clients.All.SendAsync("ChartDataByAge", await GetTestsGrouped("Age"));

            return Ok();
        }

        private async Task<Dictionary<string, int>> GetTestsGroupedByGender()
        {
            return (await _context.Tests.GroupBy(x => x.Gender)
                    .Select(x => new { title = x.Key, count = x.Count() })
                    .ToListAsync())
                .OrderBy(x => x.title)
                .ToDictionary(o => o.title, o => o.count);
        }

        private async Task<Dictionary<string, int>> GetTestsGroupedByAge()
        {
            return (await _context.Tests.GroupBy(x => x.AgeBracket)
                    .Select(x => new { title = x.Key, count = x.Count() })
                    .ToListAsync())
                .OrderBy(x => x.title)
                .ToDictionary(o => o.title, o => o.count);
        }

        private async Task<Dictionary<string, int>> GetTestsGroupedByDate()
        {
            return (await _context.Tests.GroupBy(x => x.ConfirmationDate)
                    .Select(x
                        => new { title = x.Key.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture), count = x.Count() })
                    .ToListAsync())
                .GroupBy(x => x.title)
                .Select(x => x.First())
                .OrderBy(x => x.title)
                .ToDictionary(o => o.title, o => o.count);
        }

        private async Task<Dictionary<string, int>> GetTestsGroupedByMunicipality()
        {
            return (await _context.Tests.GroupBy(x => x.MunicipalityName)
                    .Select(x => new { title = x.Key, count = x.Count() })
                    .ToListAsync())
                .OrderBy(x => x.title)
                .ToDictionary(o => o.title, o => o.count);
        }
    }
}
