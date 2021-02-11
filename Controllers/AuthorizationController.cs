using CovidApi.Models;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace CovidApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthorizationController : ControllerBase
    {
        private readonly CovidTestDatabaseContext _context;

        //todo: add authorization to access web api methods
        public AuthorizationController(CovidTestDatabaseContext context)
        {
            _context = context;
        }

        //todo: possible improvement to use JWT tokens
        [HttpPost]
        public async Task<IActionResult> Authenticate(AccessCredentials credentials)
        {
            var credentialsFromDatabase = await _context.Credentials.FindAsync(credentials.UserName);

            if (credentialsFromDatabase == null)
            {
                return BadRequest(new { message = "Username or password is incorrect" });
            }

            if (credentialsFromDatabase.Password != credentials.Password)
            {
                return BadRequest(new { message = "Username or password is incorrect" });
            }

            return Ok();
        }
    }
}
