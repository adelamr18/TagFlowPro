// TagFlowApi/Models/FileRow.cs
namespace TagFlowApi.Models
{
    public class FileRow
    {
        public int RowId { get; set; }
        public string Data { get; set; } = "";
        public DateTime CreatedAt { get; set; }
        public int FileId { get; set; }
        public int TagId { get; set; }


        // Foreign key to File table
        public File File { get; set; } = null!;

        // Foreign key to Tag table
        public Tag Tag { get; set; } = null!;

        // Foreign key to TagValue table
        public int TagValueId { get; set; }
        public TagValue TagValue { get; set; } = null!;
    }
}
