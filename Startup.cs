using CovidApi.Hubs;
using CovidApi.Models;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace CovidApi
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        /// <summary>
        /// todo: if needed cors and mssql configuration can be changed here
        /// </summary>
        /// todo: move config to env.Variables
        public void ConfigureServices(IServiceCollection services)
        {
            var server = Configuration["DBServer"] ?? "localhost";
            var port = Configuration["DBPort"] ?? "1433";
            var user = Configuration["DBUser"] ?? "sa";
            var password = Configuration["SA_Password"] ?? "Pa55w0rd";
            var database = Configuration["Database"] ?? "Covid";

            services.AddDbContext<CovidTestDatabaseContext>(opt => opt
            .UseSqlServer($"Server={server},{port};Database={database};User Id={user};Password={password};"));

            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy",
                    builder => builder
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .WithOrigins("http://localhost:3000")
                        .AllowAnyHeader()
                        .AllowCredentials());
            });

            services
                .AddControllers()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
                    options.JsonSerializerOptions.IgnoreNullValues = true;
                });

            services.AddSignalR();

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo
                {
                    Version = "v1",
                    Title = "API",
                });
            });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();

                app.UseSwagger();

                app.UseSwagger(x =>
                {
                    x.PreSerializeFilters.Add((swaggerDoc, httpRequest) =>
                    {
                        if (!httpRequest.Headers.ContainsKey("X-Forwarded-Host"))
                        {
                            return;
                        }

                        string serverUrl = $"{httpRequest.Headers["X-Forwarded-Proto"]}://" +
                                           $"{httpRequest.Headers["X-Forwarded-Host"]}" +
                                           $"{httpRequest.Headers["X-Forwarded-Prefix"]}";

                        swaggerDoc.Servers = new List<OpenApiServer>()
                        {
                            new OpenApiServer
                            {
                                Url = serverUrl
                            }
                        };
                    });
                });

                app.UseSwaggerUI(x =>
                {
                    x.SwaggerEndpoint("./swagger/v1/swagger.json", "API v1");
                    x.RoutePrefix = String.Empty;
                });
            }

            app.UseHttpsRedirection();

            app.UseStaticFiles();
            app.UseRouting();

            app.UseCors("CorsPolicy");

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapHub<ChartHub>("/api/CovidTests/UpdateChartData");

                endpoints.MapControllers();
            });

            PrepareDatabase.InitDatabase(app);
        }
    }
}
