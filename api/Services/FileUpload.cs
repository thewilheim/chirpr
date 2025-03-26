using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Minio;
using Minio.DataModel.Args;
using Microsoft.Extensions.Configuration;

namespace api.Services
{
    public class FileUpload : IFileUpload
    {
        private readonly IConfiguration _configuration;
        private readonly IMinioClient _minioClient;
        private readonly string _bucketName = "storage";

        public FileUpload(IConfiguration configuration)
        {
            _configuration = configuration;
            _minioClient = new MinioClient()
                .WithEndpoint(_configuration.GetConnectionString("MinioEndpoint"))
                .WithCredentials(_configuration.GetConnectionString("MinioAccessKey"), _configuration.GetConnectionString("MinioSecretKey"))
                .Build();
        }

        public async Task<object> UploadFile(IFormFile file)
        {
            if (file == null || file.Length == 0)
                throw new Exception("No file uploaded.");

            var key = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);

            try
            {
                // Check if the bucket exists, create if it does not
                var bucketExistsArgs = new BucketExistsArgs()
                    .WithBucket(_bucketName);
                bool found = await _minioClient.BucketExistsAsync(bucketExistsArgs).ConfigureAwait(false);

                if (!found)
                {
                    var makeBucketArgs = new MakeBucketArgs()
                        .WithBucket(_bucketName);
                    await _minioClient.MakeBucketAsync(makeBucketArgs).ConfigureAwait(false);
                }

                // Upload file to the bucket
                using (var stream = file.OpenReadStream())
                {
                    var putObjectArgs = new PutObjectArgs()
                        .WithBucket(_bucketName)
                        .WithObject(key)
                        .WithStreamData(file.OpenReadStream())
                        .WithObjectSize(file.Length)
                        .WithContentType(file.ContentType);
                    
                    await _minioClient.PutObjectAsync(putObjectArgs).ConfigureAwait(false);
                    Console.WriteLine("Successfully uploaded " + key);
                }

                var fileUrl = $"{_configuration.GetConnectionString("BlobUrl")}/{_bucketName}/{key}"; // URL to access the file

                return new { Message = "File uploaded successfully", FileUrl = fileUrl };
            }
            catch (Exception ex)
            {
                throw new Exception($"Internal server error: {ex.Message}");
            }
        }
    }
}
