using OfficeOpenXml;
using TagFlowApi.Models;
using TagFlowApi.Infrastructure;
using TagFlowApi.DTOs;
using Microsoft.EntityFrameworkCore;

using File = TagFlowApi.Models.File;

namespace TagFlowApi.Repositories
{
    public class FileRepository
    {
        private readonly DataContext _context;
        private static readonly string SSN_COLUMN = "ssn";
        private static readonly string PROCESSED_STATUS = "Processed";
        private static readonly string PROCESSING_STATUS = "Processing";
        private static readonly string UNPROCESSED_STATUS = "Unprocessed";
        public FileRepository(DataContext context)
        {
            _context = context;
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
        }

        public async Task<List<FileRow>> GetDuplicateSSNsAsync(List<string> ssnIds)
        {
            return await _context.FileRows
                .Where(fr => (ssnIds.Contains(fr.SsnId) && fr.Status == PROCESSED_STATUS) || ssnIds.Contains(fr.SsnId))
                .ToListAsync();
        }

        public async Task<int> InsertProcessedDuplicatesAsync(List<FileRow> duplicateRows, string fileName, string uploadedBy)
        {
            var generatedFileName = $"{DateTime.Now:yyyyMMdd_HHmmss}_{fileName}";
            var duplicateFile = new File
            {
                FileName = generatedFileName,
                CreatedAt = DateTime.UtcNow,
                FileStatus = PROCESSED_STATUS,
                FileRowsCounts = duplicateRows.Count,
                UploadedByUserName = uploadedBy
            };

            _context.Files.Add(duplicateFile);
            await _context.SaveChangesAsync();

            foreach (var duplicate in duplicateRows)
            {
                var newFileRow = new FileRow
                {
                    FileId = duplicateFile.FileId,
                    SsnId = duplicate.SsnId,
                    Status = PROCESSED_STATUS
                };
                _context.FileRows.Add(newFileRow);
            }

            await _context.SaveChangesAsync();
            return duplicateFile.FileId;
        }

        public async Task InsertUnprocessedRowsAsync(int fileId, List<string> ssnIds)
        {
            var newRows = ssnIds.Select(ssn => new FileRow
            {
                FileId = fileId,
                SsnId = ssn,
                Status = UNPROCESSED_STATUS
            }).ToList();

            await _context.FileRows.AddRangeAsync(newRows);
            await _context.SaveChangesAsync();
        }

        public async Task<string> GenerateExcelFileAsync(List<FileRow> rows, string originalFileName)
        {
            using var package = new ExcelPackage();
            var worksheet = package.Workbook.Worksheets.Add("Merged Data");

            worksheet.Cells[1, 1].Value = "SSN";
            worksheet.Cells[1, 2].Value = "Processed Data";

            int rowNumber = 2;
            foreach (var row in rows)
            {
                worksheet.Cells[rowNumber, 1].Value = row.SsnId;
                rowNumber++;
            }

            var filePath = Path.Combine("PathToSaveFiles", $"{originalFileName}_merged.xlsx");
            await System.IO.File.WriteAllBytesAsync(filePath, package.GetAsByteArray());
            return filePath;
        }

        public async Task<(string? filePath, int newFileId)> UploadFileAsync(AddFileDto fileDto, Stream fileStream)
        {
            if (!fileStream.CanRead)
            {
                throw new Exception("Invalid file stream. The file cannot be read.");
            }

            var (isExcel, hasSsnColumn, headers) = ValidateExcelFile(fileStream);
            if (!isExcel)
            {
                throw new Exception("The uploaded file is not a valid Excel file.");
            }
            if (!hasSsnColumn)
            {
                throw new Exception("The uploaded Excel file does not contain a column named 'SSN'.");
            }

            var ssnIds = await ExtractSsnIdsFromExcel(fileStream);
            var fileName = fileDto.AddedFileName;

            var newFile = new File
            {
                FileName = fileName,
                CreatedAt = DateTime.UtcNow,
                FileStatus = fileDto.FileStatus,
                FileRowsCounts = ssnIds.Count,
                UploadedByUserName = fileDto.UploadedByUserName
            };

            _context.Files.Add(newFile);
            await _context.SaveChangesAsync();

            var existingDuplicatesTask = GetDuplicateSSNsAsync(ssnIds);
            var newSsnIds = ssnIds.Except(existingDuplicatesTask.Result.Select(d => d.SsnId)).ToList();

            var existingDuplicates = await existingDuplicatesTask;

            var fileRows = new List<FileRow>();

            fileRows.AddRange(existingDuplicates.Select(duplicate => new FileRow
            {
                FileId = newFile.FileId,
                SsnId = duplicate.SsnId,
                Status = PROCESSED_STATUS
            }));

            fileRows.AddRange(newSsnIds.Select(ssn => new FileRow
            {
                FileId = newFile.FileId,
                SsnId = ssn,
                Status = UNPROCESSED_STATUS
            }));

            _context.FileRows.AddRange(fileRows);

            var fileTags = fileDto.SelectedTags.Select(tag => new FileTag
            {
                FileId = newFile.FileId,
                TagId = tag.TagId,
                TagValuesIds = tag.TagValuesIds
            }).ToList();

            _context.FileTags.AddRange(fileTags);

            await _context.SaveChangesAsync();

            string? filePath = null;
            if (existingDuplicates.Any())
            {
                filePath = await GenerateMergedExcelFileAsync(newFile.FileId, fileDto.File);
            }

            return (filePath, newFile.FileId);
        }


        private static (bool isExcel, bool hasSsnColumn, List<string> headers) ValidateExcelFile(Stream fileStream)
        {
            using var package = new ExcelPackage(fileStream);
            var worksheet = package.Workbook.Worksheets.FirstOrDefault();

            if (worksheet == null)
            {
                return (false, false, new List<string>());
            }

            var headers = new List<string>();
            for (int col = 1; col <= worksheet.Dimension.End.Column; col++)
            {
                headers.Add(worksheet.Cells[1, col].Text.Trim());
            }

            var hasSsnColumn = headers.Any(header => string.Equals(header, "SSN", StringComparison.OrdinalIgnoreCase));

            return (true, hasSsnColumn, headers);
        }

        private static Dictionary<string, List<string>> ExtractDynamicDataFromExcel(Stream fileStream, List<string> headers)
        {
            using var package = new ExcelPackage(fileStream);
            var worksheet = package.Workbook.Worksheets.First();

            var rowDataDictionary = new Dictionary<string, List<string>>();

            foreach (var header in headers)
            {
                rowDataDictionary[header] = new List<string>();
            }

            for (int row = 2; row <= worksheet.Dimension.End.Row; row++)
            {
                for (int col = 1; col <= worksheet.Dimension.End.Column; col++)
                {
                    var header = worksheet.Cells[1, col].Text.Trim();

                    if (!string.IsNullOrEmpty(header) && headers.Contains(header))
                    {
                        var cellValue = worksheet.Cells[row, col].Text.Trim();
                        rowDataDictionary[header].Add(cellValue);
                    }
                }
            }

            return rowDataDictionary;
        }

        public async Task<List<string>> ExtractSsnIdsFromExcel(Stream fileStream)
        {
            var ssnIds = new List<string>();

            using (var package = new ExcelPackage(fileStream))
            {
                var worksheet = package.Workbook.Worksheets[0];
                if (worksheet == null)
                {
                    throw new Exception("The Excel file does not contain any worksheet.");
                }

                var headerRow = worksheet.Cells[1, 1, 1, worksheet.Dimension.Columns];
                int ssnColumnIndex = -1;

                foreach (var cell in headerRow)
                {
                    if (cell.Text.Trim().ToLower() == SSN_COLUMN)
                    {
                        ssnColumnIndex = cell.Start.Column;
                        break;
                    }
                }

                if (ssnColumnIndex == -1)
                {
                    throw new Exception("The Excel file must contain a column named 'ssn'.");
                }

                for (int row = 2; row <= worksheet.Dimension.Rows; row++)
                {
                    var ssnValue = worksheet.Cells[row, ssnColumnIndex].Text.Trim();
                    if (!string.IsNullOrEmpty(ssnValue))
                    {
                        ssnIds.Add(ssnValue);
                    }
                }
            }

            return await Task.FromResult(ssnIds);
        }

        public async Task<List<FileRow>> FetchAndLockUnprocessedRowsAsync(int batchSize)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var unprocessedRows = await _context.FileRows
                    .Where(fr => fr.Status == UNPROCESSED_STATUS)
                    .OrderBy(fr => fr.FileRowId)
                    .Take(batchSize)
                    .ToListAsync();

                if (unprocessedRows.Any())
                {
                    foreach (var row in unprocessedRows)
                    {
                        row.Status = PROCESSING_STATUS;
                    }

                    await _context.SaveChangesAsync();
                }

                await transaction.CommitAsync();
                return unprocessedRows;
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task UpdateProcessedDataAsync(int fileId, List<FileRowDto> updates)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var rowsToUpdate = await _context.FileRows
                    .Where(fr => fr.FileId == fileId && updates.Select(u => u.FileRowId).Contains(fr.FileRowId))
                    .ToListAsync();

                if (!rowsToUpdate.Any())
                {
                    throw new Exception("No rows found to update.");
                }

                foreach (var update in updates)
                {
                    var fileRow = rowsToUpdate.FirstOrDefault(fr => fr.FileRowId == update.FileRowId);
                    if (fileRow != null)
                    {
                        fileRow.Status = PROCESSED_STATUS;
                        fileRow.SsnId = update.Ssn;
                        fileRow.InsuranceCompany = update.InsuranceCompany;
                        fileRow.MedicalNetwork = update.MedicalNetwork;
                        fileRow.IdentityNumber = update.IdentityNumber;
                        fileRow.PolicyNumber = update.PolicyNumber;
                        fileRow.Class = update.Class;
                        fileRow.DeductIblerate = update.DeductIblerate;
                        fileRow.MaxLimit = update.MaxLimit;
                        fileRow.UploadDate = update.UploadDate;
                        fileRow.InsuranceExpiryDate = update.InsuranceExpiryDate;
                        fileRow.BeneficiaryType = update.BeneficiaryType;
                        fileRow.BeneficiaryNumber = update.BeneficiaryNumber;
                    }
                }

                await _context.SaveChangesAsync();

                var remainingUnprocessed = await _context.FileRows
                    .Where(fr => fr.FileId == fileId && fr.Status != PROCESSED_STATUS)
                    .AnyAsync();

                // if (!remainingUnprocessed)
                // {
                //     var file = await _context.Files.FindAsync(fileId);
                //     if (file != null)
                //     {
                //         file.FileStatus = PROCESSED_STATUS;
                //         file.DownloadLink = await GenerateMergedExcelFileAsync(fileId);
                //     }
                //     await _context.SaveChangesAsync();
                // }

                await transaction.CommitAsync();
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        private async Task<string> GenerateMergedExcelFileAsync(int fileId, IFormFile originalFile)
        {
            var dbHeaders = new[]
            {
            "InsuranceCompany", "MedicalNetwork", "IdentityNumber",
            "PolicyNumber", "Class", "DeductIblerate", "MaxLimit",
            "UploadDate", "InsuranceExpiryDate", "BeneficiaryType", "BeneficiaryNumber"
            };

            var uploadedData = ReadOriginalExcelDataAsync(originalFile);

            var ssnIds = uploadedData.Select(row => row.ContainsKey("ssn") ? row["ssn"] : null)
                                      .Where(ssn => !string.IsNullOrEmpty(ssn))
                                      .ToList();

            var dbRows = await _context.FileRows
                .Where(fr => ssnIds.Contains(fr.SsnId) && fr.Status == PROCESSED_STATUS)
                .Distinct()
                .ToListAsync();

            var directoryPath = Path.Combine(Path.GetTempPath(), "MergedFiles");
            if (!Directory.Exists(directoryPath))
            {
                Directory.CreateDirectory(directoryPath);
            }

            var fileName = $"File_{fileId}_Merged.xlsx";
            var filePath = Path.Combine(directoryPath, fileName);

            using var package = new ExcelPackage();
            var worksheet = package.Workbook.Worksheets.Add("Merged Data");
            var dynamicHeaders = uploadedData.FirstOrDefault()?.Keys.ToList() ?? new List<string>();
            var allHeaders = dynamicHeaders.Concat(dbHeaders).ToList();

            for (int col = 0; col < allHeaders.Count; col++)
            {
                worksheet.Cells[1, col + 1].Value = allHeaders[col];
            }

            int rowNumber = 2;

            foreach (var uploadedRow in uploadedData)
            {
                if (!uploadedRow.ContainsKey("ssn")) continue;

                var ssnId = uploadedRow["ssn"];
                var matchingDbRow = dbRows.FirstOrDefault(dbRow => dbRow.SsnId == ssnId);

                for (int col = 0; col < dynamicHeaders.Count; col++)
                {
                    var key = dynamicHeaders[col];
                    worksheet.Cells[rowNumber, col + 1].Value = uploadedRow.ContainsKey(key) ? uploadedRow[key] : null;
                }

                if (matchingDbRow != null)
                {
                    worksheet.Cells[rowNumber, dynamicHeaders.Count + 1].Value = matchingDbRow.InsuranceCompany;
                    worksheet.Cells[rowNumber, dynamicHeaders.Count + 2].Value = matchingDbRow.MedicalNetwork;
                    worksheet.Cells[rowNumber, dynamicHeaders.Count + 3].Value = matchingDbRow.IdentityNumber;
                    worksheet.Cells[rowNumber, dynamicHeaders.Count + 4].Value = matchingDbRow.PolicyNumber;
                    worksheet.Cells[rowNumber, dynamicHeaders.Count + 5].Value = matchingDbRow.Class;
                    worksheet.Cells[rowNumber, dynamicHeaders.Count + 6].Value = matchingDbRow.DeductIblerate;
                    worksheet.Cells[rowNumber, dynamicHeaders.Count + 7].Value = matchingDbRow.MaxLimit;
                    worksheet.Cells[rowNumber, dynamicHeaders.Count + 8].Value = matchingDbRow.UploadDate;
                    worksheet.Cells[rowNumber, dynamicHeaders.Count + 9].Value = matchingDbRow.InsuranceExpiryDate;
                    worksheet.Cells[rowNumber, dynamicHeaders.Count + 10].Value = matchingDbRow.BeneficiaryType;
                    worksheet.Cells[rowNumber, dynamicHeaders.Count + 11].Value = matchingDbRow.BeneficiaryNumber;
                }

                rowNumber++;
            }

            await System.IO.File.WriteAllBytesAsync(filePath, package.GetAsByteArray());

            return fileName;
        }

        private static List<Dictionary<string, string>> ReadOriginalExcelDataAsync(IFormFile file)
        {
            var result = new List<Dictionary<string, string>>();

            using (var stream = file.OpenReadStream())
            {
                using (var package = new ExcelPackage(stream))
                {
                    var worksheet = package.Workbook.Worksheets[0];
                    var rowCount = worksheet.Dimension.Rows;
                    var columnCount = worksheet.Dimension.Columns;

                    var header = new List<string>();
                    for (int col = 1; col <= columnCount; col++)
                    {
                        header.Add(worksheet.Cells[1, col].Text);
                    }

                    for (int row = 2; row <= rowCount; row++)
                    {
                        var rowData = new Dictionary<string, string>();
                        for (int col = 1; col <= columnCount; col++)
                        {
                            rowData[header[col - 1]] = worksheet.Cells[row, col].Text;
                        }
                        result.Add(rowData);
                    }
                }
            }

            return result;
        }
    }
}
