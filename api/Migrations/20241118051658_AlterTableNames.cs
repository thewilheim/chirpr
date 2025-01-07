using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class AlterTableNames : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Follower_Users_FollowedId",
                table: "Follower");

            migrationBuilder.DropForeignKey(
                name: "FK_Follower_Users_FollowerId",
                table: "Follower");

            migrationBuilder.RenameColumn(
                name: "FollowedId",
                table: "Follower",
                newName: "followedId");

            migrationBuilder.RenameColumn(
                name: "FollowerId",
                table: "Follower",
                newName: "followerId");

            migrationBuilder.RenameIndex(
                name: "IX_Follower_FollowedId",
                table: "Follower",
                newName: "IX_Follower_followedId");

            migrationBuilder.AddForeignKey(
                name: "FK_Follower_Users_followedId",
                table: "Follower",
                column: "followedId",
                principalTable: "Users",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Follower_Users_followerId",
                table: "Follower",
                column: "followerId",
                principalTable: "Users",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Follower_Users_followedId",
                table: "Follower");

            migrationBuilder.DropForeignKey(
                name: "FK_Follower_Users_followerId",
                table: "Follower");

            migrationBuilder.RenameColumn(
                name: "followedId",
                table: "Follower",
                newName: "FollowedId");

            migrationBuilder.RenameColumn(
                name: "followerId",
                table: "Follower",
                newName: "FollowerId");

            migrationBuilder.RenameIndex(
                name: "IX_Follower_followedId",
                table: "Follower",
                newName: "IX_Follower_FollowedId");

            migrationBuilder.AddForeignKey(
                name: "FK_Follower_Users_FollowedId",
                table: "Follower",
                column: "FollowedId",
                principalTable: "Users",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Follower_Users_FollowerId",
                table: "Follower",
                column: "FollowerId",
                principalTable: "Users",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
