using CsvHelper;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace CovidApi.Models
{
    public static class PrepareDatabase
    {
        private const int BatchSize = 1000;

        public static void InitDatabase(IApplicationBuilder app)
        {
            using var serviceScope = app.ApplicationServices.CreateScope();

            var context = serviceScope.ServiceProvider.GetService<CovidTestDatabaseContext>();
            CreateCovidTestsDatabase(context);
            CreateAuthorizationDatabase(context);
        }

        private static void CreateAuthorizationDatabase(CovidTestDatabaseContext context)
        {
            context.Database.Migrate();

            if (!context.Credentials.Any())
            {
                var data = new List<AccessCredentials>()
                {
                    new AccessCredentials(1, "admin", "admin"),
                    new AccessCredentials(2, "test", "password")
                };

                context.Credentials.AddRange(data);
                context.SaveChanges();
                data.Clear();
            }
            else
            {
                Console.WriteLine("DB already populated...");
            }
        }

        //todo: csv logic can be moved to service class
        private static void CreateCovidTestsDatabase(CovidTestDatabaseContext context)
        {
            context.Database.Migrate();

            if (!context.Tests.Any())
            {
                var data = new List<CovidTest>();

                using var reader = new StreamReader("COVID19 cases.csv");
                using var csv = new CsvReader(reader);

                while (csv.Read())
                {
                    data.Add(new CovidTest
                    {
                        XCoordinate = csv.GetField("X"),
                        YCoordinate = csv.GetField("Y"),
                        CaseCode = csv.GetField("case_code"),
                        ConfirmationDate = DateTime.Parse(csv.GetField("confirmation_date")).ToUniversalTime(),
                        MunicipalityCode = csv.GetField("municipality_code"),
                        MunicipalityName = csv.GetField("municipality_name"),
                        AgeBracket = csv.GetField("age_bracket"),
                        Gender = csv.GetField("gender"),
                        Id = int.Parse(csv.GetField("object_id"))
                    });

                    if (data.Count == BatchSize)
                    {
                        SaveCovidTestsChanges(context, data);
                    }
                }

                SaveCovidTestsChanges(context, data);
            }
            else
            {
                Console.WriteLine("DB already populated...");
            }
        }

        private static void SaveCovidTestsChanges(CovidTestDatabaseContext context, List<CovidTest> data)
        {
            context.Tests.AddRange(data);
            context.SaveChanges();
            data.Clear();
        }
    }
}
