using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace CodePulse.API.Data
{
    public class AuthDbContext : IdentityDbContext
    {
        public AuthDbContext(DbContextOptions <AuthDbContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            var readerRoleId = "d263eca3-4ac3-4708-925a-7a2a5adb97d5";
            var writerRoleId = "8be69c16-3c88-445f-9adb-cb1408b63d47";
            // Create Reader and Writer Role
            var roles = new List<IdentityRole>
            {
                new IdentityRole()
                {
                    Id = readerRoleId,
                    Name = "Reader",
                    NormalizedName = "Reader".ToUpper(),
                    ConcurrencyStamp = readerRoleId
                },
                new IdentityRole()
                {
                    Id = writerRoleId,
                    Name = "Writer",
                    NormalizedName = "Writer".ToUpper(),
                    ConcurrencyStamp = writerRoleId
                }
            };

            // Seed the roles
            builder.Entity<IdentityRole>().HasData(roles);

            // Create a Admin User
            var adminUserId = "d6c2b8f4-be35-4dec-a1cd-abaa1e693c5f";
            var admin = new IdentityUser()
            {
                Id = adminUserId,
                UserName = "admin@codepulse.com",
                Email = "admin@codepulse.com",
                NormalizedUserName = "admin@codepulse.com".ToUpper(),
                NormalizedEmail = "admin@codepulse.com".ToUpper(),
                SecurityStamp = adminUserId,
                ConcurrencyStamp = adminUserId
            };

            admin.PasswordHash = "AQAAAAIAAYagAAAAEBcVYNqxsJVccawyB2U+MswekAB9SuRi1E5Ey9DFW6yMBJJOmrH5z1TOksm/m8iJDQ==";            
            builder.Entity<IdentityUser>().HasData(admin);

            // Give Roles to Admin User
            var adminRoles = new List<IdentityUserRole<string>>()
            {
                new() {
                    UserId = adminUserId,
                    RoleId = readerRoleId
                },
                new() 
                {
                    UserId = adminUserId,
                    RoleId = writerRoleId   
                }

            };
            builder.Entity<IdentityUserRole<string>>().HasData(adminRoles);
        }
    }
}
