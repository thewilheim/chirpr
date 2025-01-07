using api.DTOs;
using api.Models;
using api.Models.Chirps;
using api.Models.Likes;
using api.Services;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{

    [Route("/api/v1/chirp")]
    public class ChirpController : Controller
    {
        private readonly ILogger<ChirpController> _logger;
        private readonly IChirpsService _chirpService;
        private readonly IMapper _mapper;

        public ChirpController(ILogger<ChirpController> logger, IChirpsService chirpService, IMapper mapper)
        {
            _logger = logger;
            _chirpService = chirpService;
            _mapper = mapper;
        }


        [HttpPost("create")]
        public async Task<IActionResult> CreateChirp ([FromBody] Chirp chirp)
        {
            var result = await _chirpService.CreateChirp(chirp);

            if(result == null) return BadRequest("Unable to create chirp");

            return Ok(_mapper.Map<ChirpDTO>(result));

        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAll()
        {
            var chirps = await _chirpService.GetAllChirps();
            if(chirps == null) return BadRequest("Unable to create chirp");
            return Ok(_mapper.Map<IEnumerable<ChirpDTO>>(chirps));
        }

        [HttpGet("getAllByUserID/{id}")]
        public async Task<IActionResult> GetAllChirpsByUser (long id)
        {
            var chirps = await _chirpService.GetByAllChirpsUserId(id);

            if(chirps == null) return BadRequest("Unable to create chirp");

            return Ok(_mapper.Map<IEnumerable<ChirpDTO>>(chirps));
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetChirpById (long id)
        {
            var chirps = await _chirpService.GetChirpById(id);

            if(chirps == null) return BadRequest("Unable to create chirp");

            return Ok(_mapper.Map<ChirpDTO>(chirps));
        }


        [HttpPost("like")]
        public async Task<IActionResult> LikeChirp ([FromBody] Like like)
        {
            await _chirpService.LikeChirp(like);

            return Ok(like);
        }

        [HttpDelete("unlike")]
        public async Task<IActionResult> UnlikeChirp ([FromBody] Like like)
        {
            await _chirpService.UnlikeChirp(like);
            return Ok(like);
        }


        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteChirp(long id)
        {
            var chirp = await _chirpService.DeleteChirp(id);

            if(chirp == null) return NotFound();

            return Ok(chirp);
        }


        [HttpGet("{id}/replies")]
        public async Task<IActionResult> GetRepliesToChirp(long id)
        {
            var replies = await _chirpService.GetAllRepliesByChirpId(id);

            if(replies == null) return NotFound();

            return Ok(_mapper.Map<IEnumerable<ChirpDTO>>(replies));
        }


        [HttpGet("rechirps/getAllByChirpID/{id}")]
        public async Task<IActionResult> GetRechirpsByChirpID(long id)
        {
            var replies = await _chirpService.GetAllRechirpsByChirpID(id);
            return Ok(replies);
        }

        [HttpPost("rechirps/create")]
        public async Task<IActionResult> CreateRechirp([FromBody] Rechirp rechirp)
        {
            var result = await _chirpService.CreateRechirp(rechirp);

            if(result == null) return BadRequest("Unable to create rechirp");

            return Ok(rechirp);
        }

        [HttpGet("rechirps/getAllByUserId/{id}")]
        public async Task<IActionResult> GetRechirpsByUserId(long id)
        {
            var rechirps = await _chirpService.GetAllRechirpsByUser(id);
            return Ok(rechirps);
        }

        [HttpDelete("rechirps/remove")]
        public async Task<IActionResult> RemoveRechirp ([FromBody] Rechirp rechirp)
        {
            await _chirpService.RemoveRechirp(rechirp);
            return Ok(rechirp);
        }


    }
}