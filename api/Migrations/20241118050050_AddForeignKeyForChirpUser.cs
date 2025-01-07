using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class AddForeignKeyForChirpUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "User_id",
                table: "Chirps",
                newName: "user_id");

            migrationBuilder.RenameColumn(
                name: "Parent_id",
                table: "Chirps",
                newName: "parent_id");

            migrationBuilder.RenameColumn(
                name: "Media_url",
                table: "Chirps",
                newName: "media_url");

            migrationBuilder.RenameColumn(
                name: "Content",
                table: "Chirps",
                newName: "content");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Chirps",
                newName: "id");

            migrationBuilder.CreateIndex(
                name: "IX_Chirps_user_id",
                table: "Chirps",
                column: "user_id");

            migrationBuilder.AddForeignKey(
                name: "FK_Chirps_Users_user_id",
                table: "Chirps",
                column: "user_id",
                principalTable: "Users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Chirps_Users_user_id",
                table: "Chirps");

            migrationBuilder.DropIndex(
                name: "IX_Chirps_user_id",
                table: "Chirps");

            migrationBuilder.RenameColumn(
                name: "user_id",
                table: "Chirps",
                newName: "User_id");

            migrationBuilder.RenameColumn(
                name: "parent_id",
                table: "Chirps",
                newName: "Parent_id");

            migrationBuilder.RenameColumn(
                name: "media_url",
                table: "Chirps",
                newName: "Media_url");

            migrationBuilder.RenameColumn(
                name: "content",
                table: "Chirps",
                newName: "Content");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "Chirps",
                newName: "Id");
        }
    }
}
