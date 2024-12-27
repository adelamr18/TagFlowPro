namespace TagFlowApi.Dtos
{
    public class TagUpdateDto
    {
        public int TagId { get; set; }
        public string TagName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public List<string> TagValues { get; set; } = [];
    }
}
