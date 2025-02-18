﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using api.Data;

#nullable disable

namespace api.Migrations
{
    [DbContext(typeof(AppDbContext))]
    [Migration("20250217224132_ViewsTable2")]
    partial class ViewsTable2
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.10")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("api.Models.Chirp", b =>
                {
                    b.Property<long>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<long>("id"));

                    b.Property<string>("content")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("createdAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("timestamp with time zone")
                        .HasDefaultValueSql("CURRENT_TIMESTAMP");

                    b.Property<string>("media_url")
                        .HasColumnType("text");

                    b.Property<long>("parent_id")
                        .HasColumnType("bigint");

                    b.Property<int>("privacy")
                        .HasColumnType("integer");

                    b.Property<long>("user_id")
                        .HasColumnType("bigint");

                    b.HasKey("id");

                    b.HasIndex("user_id");

                    b.ToTable("Chirps");
                });

            modelBuilder.Entity("api.Models.Chirps.Rechirp", b =>
                {
                    b.Property<long>("chirp_id")
                        .HasColumnType("bigint");

                    b.Property<long>("user_id")
                        .HasColumnType("bigint");

                    b.Property<DateTime>("createdAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("timestamp with time zone")
                        .HasDefaultValueSql("CURRENT_TIMESTAMP");

                    b.HasKey("chirp_id", "user_id");

                    b.HasIndex("user_id");

                    b.ToTable("Rechirps");
                });

            modelBuilder.Entity("api.Models.Conversations.Conversation", b =>
                {
                    b.Property<long>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<long>("id"));

                    b.Property<long>("user_one_id")
                        .HasColumnType("bigint");

                    b.Property<long>("user_two_id")
                        .HasColumnType("bigint");

                    b.HasKey("id");

                    b.HasIndex("user_one_id");

                    b.HasIndex("user_two_id");

                    b.ToTable("Conversations");
                });

            modelBuilder.Entity("api.Models.Follower", b =>
                {
                    b.Property<long>("followerId")
                        .HasColumnType("bigint");

                    b.Property<long>("followedId")
                        .HasColumnType("bigint");

                    b.Property<DateTime>("createdAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("timestamp with time zone")
                        .HasDefaultValueSql("CURRENT_TIMESTAMP");

                    b.HasKey("followerId", "followedId");

                    b.HasIndex("followedId");

                    b.ToTable("Followers");
                });

            modelBuilder.Entity("api.Models.Likes.Like", b =>
                {
                    b.Property<long>("chirp_id")
                        .HasColumnType("bigint");

                    b.Property<long>("user_id")
                        .HasColumnType("bigint");

                    b.Property<DateTime>("createdAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("timestamp with time zone")
                        .HasDefaultValueSql("CURRENT_TIMESTAMP");

                    b.HasKey("chirp_id", "user_id");

                    b.HasIndex("user_id");

                    b.ToTable("Likes");
                });

            modelBuilder.Entity("api.Models.Message.Message", b =>
                {
                    b.Property<long>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<long>("id"));

                    b.Property<string>("content")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<long>("conversation_id")
                        .HasColumnType("bigint");

                    b.Property<DateTime>("created_at")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("timestamp with time zone")
                        .HasDefaultValueSql("CURRENT_TIMESTAMP");

                    b.Property<long>("message_from")
                        .HasColumnType("bigint");

                    b.Property<long>("message_to")
                        .HasColumnType("bigint");

                    b.HasKey("id");

                    b.HasIndex("conversation_id");

                    b.ToTable("Messages");
                });

            modelBuilder.Entity("api.Models.Notification.Notification", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<int>("Action_Type")
                        .HasColumnType("integer");

                    b.Property<bool>("Has_Viewed")
                        .HasColumnType("boolean");

                    b.Property<int>("Recieving_User_Id")
                        .HasColumnType("integer");

                    b.Property<long>("Sending_User_Id")
                        .HasColumnType("bigint");

                    b.HasKey("Id");

                    b.HasIndex("Sending_User_Id");

                    b.ToTable("Notifications");
                });

            modelBuilder.Entity("api.Models.User", b =>
                {
                    b.Property<long>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<long>("id"));

                    b.Property<string>("RefreshToken")
                        .HasColumnType("text");

                    b.Property<DateTime>("RefreshTokenExpiry")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("bio")
                        .HasColumnType("text");

                    b.Property<DateTime>("createdAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("timestamp with time zone")
                        .HasDefaultValueSql("CURRENT_TIMESTAMP");

                    b.Property<string>("email")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("first_name")
                        .HasColumnType("text");

                    b.Property<string>("last_name")
                        .HasColumnType("text");

                    b.Property<string>("password")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("privacy")
                        .HasColumnType("integer");

                    b.Property<string>("profile_picture_url")
                        .HasColumnType("text");

                    b.Property<string>("username")
                        .HasColumnType("text");

                    b.HasKey("id");

                    b.HasIndex("email", "username")
                        .IsUnique();

                    b.ToTable("Users");
                });

            modelBuilder.Entity("api.Models.Views.View", b =>
                {
                    b.Property<long>("ChirpId")
                        .HasColumnType("bigint");

                    b.Property<long>("UserId")
                        .HasColumnType("bigint");

                    b.Property<DateTime>("TimeStamp")
                        .HasColumnType("timestamp with time zone");

                    b.HasKey("ChirpId", "UserId");

                    b.ToTable("Views");
                });

            modelBuilder.Entity("api.Models.Chirp", b =>
                {
                    b.HasOne("api.Models.User", "user")
                        .WithMany("Chirps")
                        .HasForeignKey("user_id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("user");
                });

            modelBuilder.Entity("api.Models.Chirps.Rechirp", b =>
                {
                    b.HasOne("api.Models.Chirp", "chirp")
                        .WithMany("Rechirps")
                        .HasForeignKey("chirp_id")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("api.Models.User", "user")
                        .WithMany("Rechirps")
                        .HasForeignKey("user_id")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("chirp");

                    b.Navigation("user");
                });

            modelBuilder.Entity("api.Models.Conversations.Conversation", b =>
                {
                    b.HasOne("api.Models.User", "user_one")
                        .WithMany()
                        .HasForeignKey("user_one_id")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("api.Models.User", "user_two")
                        .WithMany()
                        .HasForeignKey("user_two_id")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("user_one");

                    b.Navigation("user_two");
                });

            modelBuilder.Entity("api.Models.Follower", b =>
                {
                    b.HasOne("api.Models.User", "followedUser")
                        .WithMany("Followers")
                        .HasForeignKey("followedId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("api.Models.User", "followerUser")
                        .WithMany("Following")
                        .HasForeignKey("followerId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("followedUser");

                    b.Navigation("followerUser");
                });

            modelBuilder.Entity("api.Models.Likes.Like", b =>
                {
                    b.HasOne("api.Models.Chirp", "chirp")
                        .WithMany("Likes")
                        .HasForeignKey("chirp_id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("api.Models.User", "user")
                        .WithMany("Likes")
                        .HasForeignKey("user_id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("chirp");

                    b.Navigation("user");
                });

            modelBuilder.Entity("api.Models.Message.Message", b =>
                {
                    b.HasOne("api.Models.Conversations.Conversation", "conversation")
                        .WithMany()
                        .HasForeignKey("conversation_id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("conversation");
                });

            modelBuilder.Entity("api.Models.Notification.Notification", b =>
                {
                    b.HasOne("api.Models.User", "Sending_User")
                        .WithMany()
                        .HasForeignKey("Sending_User_Id")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Sending_User");
                });

            modelBuilder.Entity("api.Models.Views.View", b =>
                {
                    b.HasOne("api.Models.Chirp", "Chirp")
                        .WithMany("Views")
                        .HasForeignKey("ChirpId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Chirp");
                });

            modelBuilder.Entity("api.Models.Chirp", b =>
                {
                    b.Navigation("Likes");

                    b.Navigation("Rechirps");

                    b.Navigation("Views");
                });

            modelBuilder.Entity("api.Models.User", b =>
                {
                    b.Navigation("Chirps");

                    b.Navigation("Followers");

                    b.Navigation("Following");

                    b.Navigation("Likes");

                    b.Navigation("Rechirps");
                });
#pragma warning restore 612, 618
        }
    }
}
