namespace TagFlowApi.Dtos
{
    public class TagDto
    {
        public int TagId { get; set; }
        public string TagName { get; set; } = "";
        public List<string> TagValues { get; set; } = [];
        public List<string> AssignedUsers { get; set; } = [];
        public string CreatedByEmail { get; set; } = "";
        public string CreatedByUserName { get; set; } = "";

    }
}