using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace CraftBook.Migrations
{
    public partial class ChangedRecipeImage : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Image",
                table: "Recipe",
                nullable: true,
                oldClrType: typeof(byte[]),
                oldNullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<byte[]>(
                name: "Image",
                table: "Recipe",
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);
        }
    }
}
