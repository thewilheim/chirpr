using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;
using api.Models.Chirps;
using api.Models.Likes;

namespace api.Services
{
    public interface IChirpsService
    {
        Task<Chirp> CreateChirp(Chirp chirp);
        Task<Like> LikeChirp(Like like);
        Task<Like> UnlikeChirp(Like like);
        Task<IEnumerable<Chirp>> GetByAllChirpsUserId(long id);
        Task<Chirp> GetChirpById(long id);
        Task<IEnumerable<Chirp>> GetAllRepliesByChirpId(long id);
        Task<IEnumerable<Chirp>> GetAllChirps();
        Task<Chirp> DeleteChirp(long id);
        Task<Rechirp> CreateRechirp(Rechirp rechirp);
        Task<IEnumerable<Rechirp>> GetAllRechirpsByUser(long id);
        Task<IEnumerable<Rechirp>> GetAllRechirpsByChirpID(long id);
        Task<Rechirp> RemoveRechirp(Rechirp rechirp);
    }
}