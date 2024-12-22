// TagFlowApi/Models/UserTagPermission.cs
namespace TagFlowApi.Models
{
    public class UserTagPermission
    {
        public int Id { get; set; }

        // Foreign key to User table
        public int UserId { get; set; }
        public User User { get; set; } = null!;

        // Foreign key to Tag table
        public int TagId { get; set; }
        public Tag Tag { get; set; } = null!;
    }
}
