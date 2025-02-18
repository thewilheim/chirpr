using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class ViewsTable2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Views_Chirps_ChirpId",
                table: "Views");

            migrationBuilder.AddForeignKey(
                name: "FK_Views_Chirps_ChirpId",
                table: "Views",
                column: "ChirpId",
                principalTable: "Chirps",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Views_Chirps_ChirpId",
                table: "Views");

            migrationBuilder.AddForeignKey(
                name: "FK_Views_Chirps_ChirpId",
                table: "Views",
                column: "ChirpId",
                principalTable: "Chirps",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
