// TagFlowApi/Models/File.cs
namespace TagFlowApi.Models
{
    public class File
    {
        public int FileId { get; set; }
        public string FileName { get; set; } = "";
        public DateTime CreatedAt { get; set; }

        // Foreign key to User table (who uploaded the file)
        public int UploadedBy { get; set; }
        public User UploadedByUser { get; set; } = null!;

        // One-to-many relationship with file rows
        public ICollection<FileRow> FileRows { get; set; } = new List<FileRow>();
    }
}
