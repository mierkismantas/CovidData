using Microsoft.EntityFrameworkCore;

namespace CovidApi.Models
{
    public class CovidTestDatabaseContext : DbContext
    {
        public CovidTestDatabaseContext(DbContextOptions<CovidTestDatabaseContext> options)
            : base(options)
        {
        }

        public DbSet<CovidTest> Tests { get; set; }

        public DbSet<AccessCredentials> Credentials { get; set; }
    }
}
