using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace CovidApi.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Credentials",
                columns: table => new
                {
                    UserName = table.Column<string>(nullable: false),
                    Password = table.Column<string>(nullable: true),
                    Id = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Credentials", x => x.UserName);
                });

            migrationBuilder.CreateTable(
                name: "Tests",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false),
                    XCoordinate = table.Column<string>(nullable: true),
                    YCoordinate = table.Column<string>(nullable: true),
                    CaseCode = table.Column<string>(nullable: true),
                    ConfirmationDate = table.Column<DateTime>(nullable: false),
                    MunicipalityCode = table.Column<string>(nullable: true),
                    MunicipalityName = table.Column<string>(nullable: true),
                    AgeBracket = table.Column<string>(nullable: true),
                    Gender = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tests", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Credentials");

            migrationBuilder.DropTable(
                name: "Tests");
        }
    }
}
