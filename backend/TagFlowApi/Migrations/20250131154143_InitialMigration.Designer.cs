﻿// <auto-generated />
using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using TagFlowApi.Infrastructure;

#nullable disable

namespace TagFlowApi.Migrations
{
    [DbContext(typeof(DataContext))]
    [Migration("20250131154143_InitialMigration")]
    partial class InitialMigration
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.1")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("TagFlowApi.Models.Admin", b =>
                {
                    b.Property<int>("AdminId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("AdminId"));

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("CreatedBy")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<bool>("IsDeleted")
                        .HasColumnType("boolean");

                    b.Property<string>("PasswordHash")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("RoleId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasDefaultValue(1);

                    b.Property<string>("UpdatedBy")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("AdminId");

                    b.HasIndex("Email")
                        .IsUnique();

                    b.ToTable("Admins");
                });

            modelBuilder.Entity("TagFlowApi.Models.File", b =>
                {
                    b.Property<int>("FileId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("FileId"));

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("DownloadLink")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<byte[]>("FileContent")
                        .HasColumnType("bytea");

                    b.Property<string>("FileName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("FileRowsCounts")
                        .HasColumnType("integer");

                    b.Property<string>("FileStatus")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("UploadedByUserName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int?>("UserId")
                        .HasColumnType("integer");

                    b.HasKey("FileId");

                    b.HasIndex("UserId");

                    b.ToTable("Files");
                });

            modelBuilder.Entity("TagFlowApi.Models.FileRow", b =>
                {
                    b.Property<int>("FileRowId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("FileRowId"));

                    b.Property<string>("BeneficiaryNumber")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("BeneficiaryType")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Class")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("DeductIblerate")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("FileId")
                        .HasColumnType("integer");

                    b.Property<string>("IdentityNumber")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("InsuranceCompany")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("InsuranceExpiryDate")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("MaxLimit")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("MedicalNetwork")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("PolicyNumber")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("SsnId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Status")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("UploadDate")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("FileRowId");

                    b.HasIndex("FileId");

                    b.HasIndex("SsnId");

                    b.ToTable("FileRows");
                });

            modelBuilder.Entity("TagFlowApi.Models.FileTag", b =>
                {
                    b.Property<int>("FileTagId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("FileTagId"));

                    b.Property<int>("FileId")
                        .HasColumnType("integer");

                    b.Property<int>("TagId")
                        .HasColumnType("integer");

                    b.Property<int?>("TagValueId")
                        .HasColumnType("integer");

                    b.PrimitiveCollection<List<int>>("TagValuesIds")
                        .IsRequired()
                        .HasColumnType("integer[]");

                    b.HasKey("FileTagId");

                    b.HasIndex("TagId");

                    b.HasIndex("TagValueId");

                    b.HasIndex("FileId", "TagId")
                        .IsUnique();

                    b.ToTable("FileTags");
                });

            modelBuilder.Entity("TagFlowApi.Models.Role", b =>
                {
                    b.Property<int>("RoleId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("RoleId"));

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int>("CreatedBy")
                        .HasColumnType("integer");

                    b.Property<string>("RoleName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("UpdatedBy")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("RoleId");

                    b.HasIndex("CreatedBy");

                    b.ToTable("Roles");
                });

            modelBuilder.Entity("TagFlowApi.Models.Tag", b =>
                {
                    b.Property<int>("TagId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("TagId"));

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int>("CreatedBy")
                        .HasColumnType("integer");

                    b.Property<string>("Description")
                        .HasColumnType("text");

                    b.Property<string>("TagName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("UpdatedBy")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("TagId");

                    b.HasIndex("CreatedBy");

                    b.ToTable("Tags");
                });

            modelBuilder.Entity("TagFlowApi.Models.TagValue", b =>
                {
                    b.Property<int>("TagValueId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("TagValueId"));

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int>("CreatedBy")
                        .HasColumnType("integer");

                    b.Property<int>("TagId")
                        .HasColumnType("integer");

                    b.Property<string>("Value")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("TagValueId");

                    b.HasIndex("CreatedBy");

                    b.HasIndex("TagId");

                    b.ToTable("TagValues");
                });

            modelBuilder.Entity("TagFlowApi.Models.User", b =>
                {
                    b.Property<int>("UserId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("UserId"));

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int>("CreatedBy")
                        .HasColumnType("integer");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("PasswordHash")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("RoleId")
                        .HasColumnType("integer");

                    b.Property<string>("UpdatedBy")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("UserId");

                    b.HasIndex("CreatedBy");

                    b.HasIndex("Email")
                        .IsUnique();

                    b.HasIndex("RoleId");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("TagFlowApi.Models.UserTagPermission", b =>
                {
                    b.Property<int>("UserId")
                        .HasColumnType("integer");

                    b.Property<int>("TagId")
                        .HasColumnType("integer");

                    b.Property<int>("Id")
                        .HasColumnType("integer");

                    b.HasKey("UserId", "TagId");

                    b.HasIndex("TagId");

                    b.ToTable("UserTagPermissions");
                });

            modelBuilder.Entity("TagFlowApi.Models.File", b =>
                {
                    b.HasOne("TagFlowApi.Models.User", null)
                        .WithMany("Files")
                        .HasForeignKey("UserId");
                });

            modelBuilder.Entity("TagFlowApi.Models.FileRow", b =>
                {
                    b.HasOne("TagFlowApi.Models.File", "File")
                        .WithMany("FileRows")
                        .HasForeignKey("FileId")
                        .OnDelete(DeleteBehavior.SetNull)
                        .IsRequired();

                    b.Navigation("File");
                });

            modelBuilder.Entity("TagFlowApi.Models.FileTag", b =>
                {
                    b.HasOne("TagFlowApi.Models.File", "File")
                        .WithMany("FileTags")
                        .HasForeignKey("FileId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("TagFlowApi.Models.Tag", "Tag")
                        .WithMany("FileTags")
                        .HasForeignKey("TagId")
                        .OnDelete(DeleteBehavior.SetNull)
                        .IsRequired();

                    b.HasOne("TagFlowApi.Models.TagValue", null)
                        .WithMany("FileTags")
                        .HasForeignKey("TagValueId");

                    b.Navigation("File");

                    b.Navigation("Tag");
                });

            modelBuilder.Entity("TagFlowApi.Models.Role", b =>
                {
                    b.HasOne("TagFlowApi.Models.Admin", "CreatedByAdmin")
                        .WithMany("Roles")
                        .HasForeignKey("CreatedBy")
                        .OnDelete(DeleteBehavior.SetNull)
                        .IsRequired();

                    b.Navigation("CreatedByAdmin");
                });

            modelBuilder.Entity("TagFlowApi.Models.Tag", b =>
                {
                    b.HasOne("TagFlowApi.Models.Admin", "CreatedByAdmin")
                        .WithMany("Tags")
                        .HasForeignKey("CreatedBy")
                        .OnDelete(DeleteBehavior.SetNull)
                        .IsRequired();

                    b.Navigation("CreatedByAdmin");
                });

            modelBuilder.Entity("TagFlowApi.Models.TagValue", b =>
                {
                    b.HasOne("TagFlowApi.Models.Admin", "CreatedByAdmin")
                        .WithMany("TagValues")
                        .HasForeignKey("CreatedBy")
                        .OnDelete(DeleteBehavior.SetNull)
                        .IsRequired();

                    b.HasOne("TagFlowApi.Models.Tag", "Tag")
                        .WithMany("TagValues")
                        .HasForeignKey("TagId")
                        .OnDelete(DeleteBehavior.SetNull)
                        .IsRequired();

                    b.Navigation("CreatedByAdmin");

                    b.Navigation("Tag");
                });

            modelBuilder.Entity("TagFlowApi.Models.User", b =>
                {
                    b.HasOne("TagFlowApi.Models.Admin", "CreatedByAdmin")
                        .WithMany("Users")
                        .HasForeignKey("CreatedBy")
                        .OnDelete(DeleteBehavior.SetNull)
                        .IsRequired();

                    b.HasOne("TagFlowApi.Models.Role", "Role")
                        .WithMany("Users")
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.SetNull)
                        .IsRequired();

                    b.Navigation("CreatedByAdmin");

                    b.Navigation("Role");
                });

            modelBuilder.Entity("TagFlowApi.Models.UserTagPermission", b =>
                {
                    b.HasOne("TagFlowApi.Models.Tag", "Tag")
                        .WithMany("UserTagPermissions")
                        .HasForeignKey("TagId")
                        .OnDelete(DeleteBehavior.SetNull)
                        .IsRequired();

                    b.HasOne("TagFlowApi.Models.User", "User")
                        .WithMany("UserTagPermissions")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.SetNull)
                        .IsRequired();

                    b.Navigation("Tag");

                    b.Navigation("User");
                });

            modelBuilder.Entity("TagFlowApi.Models.Admin", b =>
                {
                    b.Navigation("Roles");

                    b.Navigation("TagValues");

                    b.Navigation("Tags");

                    b.Navigation("Users");
                });

            modelBuilder.Entity("TagFlowApi.Models.File", b =>
                {
                    b.Navigation("FileRows");

                    b.Navigation("FileTags");
                });

            modelBuilder.Entity("TagFlowApi.Models.Role", b =>
                {
                    b.Navigation("Users");
                });

            modelBuilder.Entity("TagFlowApi.Models.Tag", b =>
                {
                    b.Navigation("FileTags");

                    b.Navigation("TagValues");

                    b.Navigation("UserTagPermissions");
                });

            modelBuilder.Entity("TagFlowApi.Models.TagValue", b =>
                {
                    b.Navigation("FileTags");
                });

            modelBuilder.Entity("TagFlowApi.Models.User", b =>
                {
                    b.Navigation("Files");

                    b.Navigation("UserTagPermissions");
                });
#pragma warning restore 612, 618
        }
    }
}
