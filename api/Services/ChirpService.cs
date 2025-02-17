using System.Net;
using api.Data;
using api.Models;
using api.Models.Chirps;
using api.Models.Likes;
using Azure.Core;
using Microsoft.EntityFrameworkCore;

namespace api.Services
{
    public class ChirpService : IChirpsService
    {
        private readonly AppDbContext _context;

        public ChirpService(AppDbContext context)
        {
            _context = context;
        }
        public async Task<Chirp> CreateChirp(Chirp chirp)
        {
            if (string.IsNullOrEmpty(chirp.content) && string.IsNullOrEmpty(chirp.media_url))
            {
                throw new Exception("Unable to create chirp, no text or media content found");
            }

            await _context.Chirps.AddAsync(chirp);
            await _context.SaveChangesAsync();

            return chirp;
        }

        public async Task<Rechirp> CreateRechirp(Rechirp rechirp)
        {

            await _context.Rechirps.AddAsync(rechirp);
            await _context.SaveChangesAsync();
            return rechirp;
        }

        public async Task<Chirp> DeleteChirp(long id)
        {
            var chirpToRemove = await _context.Chirps.FirstOrDefaultAsync(c => c.id == id);

            if (chirpToRemove == null)
            {
                throw new Exception("Unable to find chirp");
            }
            _context.Chirps.Remove(chirpToRemove);

            await _context.SaveChangesAsync();

            return chirpToRemove;

        }

        public async Task<IEnumerable<Chirp>> GetAllChirps()
        {
            return await _context.Chirps.Where(c => c.parent_id == 0).Include(c => c.user).Include(r => r.Rechirps).Include(l => l.Likes).Take(10).OrderByDescending(c => c.createdAt).ToListAsync();
        }

        public async Task<IEnumerable<Rechirp>> GetAllRechirpsByChirpID(long id)
        {
            var rechirps = await _context.Rechirps.Where(r => r.chirp_id == id).ToListAsync();
            return rechirps;
        }

        public async Task<IEnumerable<Rechirp>> GetAllRechirpsByUser(long id)
        {
            var rechirps = await _context.Rechirps.Where(u => u.user_id == id).Include(c => c.chirp).ToListAsync();
            return rechirps;
        }

        public async Task<IEnumerable<Chirp>> GetAllRepliesByChirpId(long id)
        {
            var replies = await _context.Chirps.Where(c => c.parent_id == id).Include(u => u.user).Include(r => r.Rechirps).Include(l => l.Likes).ToListAsync();

            return replies;
        }

        public async Task<IEnumerable<Chirp>> GetByAllChirpsUserId(long id)
        {
            var chirps = await _context.Chirps.Where(c => c.parent_id == 0).Where(u => u.user_id == id).Include(r => r.Rechirps).Include(l => l.Likes).OrderByDescending(c => c.createdAt).ToListAsync();
            return chirps;
        }

        public async Task<Chirp> GetChirpById(long id)
        {
            var chirp = await _context.Chirps.Include(u => u.user).Include(r => r.Rechirps).Include(l => l.Likes).FirstOrDefaultAsync(c => c.id == id);
            if (chirp == null)
            {
                throw new Exception($"Unable to find chirp with id {id}");
            }
            return chirp;
        }

        public async Task<Like> LikeChirp(Like like)
        {
            await _context.Likes.AddAsync(like);
            await _context.SaveChangesAsync();

            return like;
        }

        public async Task<Like> UnlikeChirp(Like like)
        {
            var record = await _context.Likes.FirstOrDefaultAsync(l => l.chirp_id == like.chirp_id && l.user_id == like.user_id);
            if (record == null)
            {
                throw new Exception($"Unable to findchirp with id {like.chirp_id}");
            }
            _context.Likes.Remove(record);
            await _context.SaveChangesAsync();
            return record;
        }

        public async Task<Rechirp> RemoveRechirp(Rechirp rechirp)
        {
            var record = await _context.Rechirps.FirstOrDefaultAsync(r => r.chirp_id == rechirp.chirp_id && r.user_id == rechirp.user_id);
            if (record == null)
            {
                throw new Exception($"Unable to find rechirp with id {rechirp.chirp_id}");
            }
            _context.Rechirps.Remove(record);
            await _context.SaveChangesAsync();
            return record;
        }
    }
}