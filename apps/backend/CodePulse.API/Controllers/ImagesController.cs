using CodePulse.API.Models.Domain;
using CodePulse.API.Models.DTO;
using CodePulse.API.Repositories.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CodePulse.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImagesController : ControllerBase
    {
        private readonly IImageRepository imageRepository;

        public ImagesController(IImageRepository imageRepository)
        {
            this.imageRepository = imageRepository;
        }

        // GET: {apibaseurl}/api/Images
        [HttpGet]
        public async Task<IActionResult> GetAllImages()
        {
            var images = await imageRepository.GetAll();

            var response = new List<BlogImageDto>();
            foreach (var iamge in images) 
            {
                response.Add(new BlogImageDto
                {
                    Id = iamge.Id,
                    Title = iamge.Title,
                    DateCreated = iamge.DateCreated,
                    FileName = iamge.FileName,
                    FileExtension = iamge.FileExtension,
                    Url = iamge.Url
                });
            }
            return Ok(response);
        }

        // POST: {apibaseurl}/api/images
        [HttpPost]
        public async Task<IActionResult> UpdateImage(IFormFile file, [FromForm] string fileName, [FromForm] string title) 
        {
            ValidateFileUpload(file);
            if (ModelState.IsValid)
            {
                var blogImage = new BlogImage
                {
                    FileExtension = Path.GetExtension(file.FileName).ToLower(),
                    FileName = fileName,
                    Title = title,
                    DateCreated = DateTime.Now
                };

                blogImage = await imageRepository.Upload(file, blogImage);

                //Convert Domain Model to DTO
                var response = new BlogImageDto
                {
                    Id = blogImage.Id,
                    Title = blogImage.Title,
                    DateCreated = blogImage.DateCreated,
                    FileName = blogImage.FileName,
                    FileExtension = blogImage.FileExtension,
                    Url = blogImage.Url
                };

                return Ok(blogImage);

            }

            return BadRequest(ModelState);
        }

        private void ValidateFileUpload(IFormFile file)
        {
            var allowedExtensions = new string[] { ".jpg", ".peg", ".png" };
            if (!allowedExtensions.Contains(Path.GetExtension(file.FileName).ToLower()))
            {
                ModelState.AddModelError("file", "Unsupported file format");
            }

            if (file.Length > 10485760) 
            {
                ModelState.AddModelError("Size", "File size cannot be more than 10MB");
            }
        }
    }
}
