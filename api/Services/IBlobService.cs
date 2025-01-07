using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Services
{
    public interface IBlobService
    {
        Task<Guid> UploadAsync(Stream stream, string contentType);
        Task<FileResponse> DownloadAsync(Guid fileId);
        Task DeleteAsync(Guid fileId);
    }
}

public record FileResponse(Stream stream, string contentType);