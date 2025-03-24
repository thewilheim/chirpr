using api.Services;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

namespace api.Storage
{
    internal sealed class BlobService(BlobServiceClient blobServiceClient) : IBlobService

    {
        private const string ContainerName = "images";
        public async Task DeleteAsync(Guid fileId)
        {

            BlobContainerClient containerClient = blobServiceClient.GetBlobContainerClient(ContainerName);

            BlobClient blobClient = containerClient.GetBlobClient(fileId.ToString());

            await blobClient.DeleteIfExistsAsync();
        }

        public async Task<FileResponse> DownloadAsync(Guid fileId)
        {
            BlobContainerClient containerClient = blobServiceClient.GetBlobContainerClient(ContainerName);

            if (containerClient.Exists() == false)
            {
                await containerClient.CreateIfNotExistsAsync();
            }

            BlobClient blobClient = containerClient.GetBlobClient(fileId.ToString());
            var response = await blobClient.DownloadContentAsync();
            return new FileResponse(response.Value.Content.ToStream(), response.Value.Details.ContentType);
        }

        public async Task<Guid> UploadAsync(Stream stream, string contentType)
        {

            var fileId = Guid.NewGuid();
            BlobContainerClient containerClient = blobServiceClient.GetBlobContainerClient(ContainerName);
            BlobClient blobClient = containerClient.GetBlobClient(fileId.ToString());

            await blobClient.UploadAsync(stream, new BlobHttpHeaders { ContentType = contentType });

            return fileId;

        }
    }
}
