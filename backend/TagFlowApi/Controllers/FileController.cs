using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using TagFlowApi.DTOs;
using TagFlowApi.Repositories;

namespace TagFlowApi.Controllers
{
    [ApiController]
    [Route("api/file")]
    public class FileController : ControllerBase
    {
        private readonly FileRepository _fileRepository;

        public FileController(FileRepository fileRepository)
        {
            _fileRepository = fileRepository;
        }

        [HttpPost("upload-file")]
        public async Task<IActionResult> UploadFile([FromForm] string addedFileName,
                                             [FromForm] string fileStatus,
                                             [FromForm] int fileRowsCount,
                                             [FromForm] string uploadedByUserName,
                                             [FromForm] string selectedTags,
                                             [FromForm] IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return BadRequest(new { success = false, message = "No file provided." });
                }

                var deserializedTags = string.IsNullOrEmpty(selectedTags)
                    ? new List<TagDto>()
                    : JsonConvert.DeserializeObject<List<TagDto>>(selectedTags);

                var addFileDto = new AddFileDto
                {
                    AddedFileName = addedFileName,
                    FileStatus = fileStatus,
                    FileRowsCount = fileRowsCount,
                    UploadedByUserName = uploadedByUserName,
                    SelectedTags = deserializedTags,
                    File = file
                };

                using (var fileStream = file.OpenReadStream())
                {
                    var (filePath, fileId) = await _fileRepository.UploadFileAsync(addFileDto, fileStream);

                    return Ok(new
                    {
                        success = true,
                        filePath,
                        fileId,
                        message = "File uploaded successfully."
                    });
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }


        [HttpGet("fetch-unprocessed-ssns")]
        public async Task<IActionResult> FetchUnprocessedSSNs([FromQuery] int batchSize = 50)
        {
            try
            {
                var unprocessedRows = await _fileRepository.FetchAndLockUnprocessedRowsAsync(batchSize);

                return Ok(new
                {
                    success = true,
                    data = unprocessedRows.Select(row => new
                    {
                        row.FileRowId,
                        row.SsnId,
                        row.FileId
                    })
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("update-processed-data")]
        public async Task<IActionResult> UpdateProcessedData(int fileId, List<FileRowDto> processedFileRows)
        {
            try
            {
                await _fileRepository.UpdateProcessedDataAsync(fileId, processedFileRows);

                return Ok(new { success = true, message = "Data updated successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

    }
}
