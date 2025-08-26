using LogsManagement.Common.Application.Services;
using System.Security.Cryptography;
using System.Text;

namespace LogsManagement.Common.Infrastructure.Services;

public sealed class PasswordHasher : IPasswordHasher
{
    private const int SaltSize = 16;
    private const int HashSize = 32;
    private const int Iterations = 10000;

    public string HashPassword(string password)
    {
        var salt = GenerateSalt();
        var hash = GenerateHash(password, salt);
        
        return Convert.ToBase64String(salt.Concat(hash).ToArray());
    }

    public bool VerifyPassword(string password, string hashedPassword)
    {
        try
        {
            var hashBytes = Convert.FromBase64String(hashedPassword);
            var salt = hashBytes.Take(SaltSize).ToArray();
            var hash = hashBytes.Skip(SaltSize).ToArray();
            
            var verifyHash = GenerateHash(password, salt);
            
            return hash.SequenceEqual(verifyHash);
        }
        catch
        {
            return false;
        }
    }

    private static byte[] GenerateSalt()
    {
        var salt = new byte[SaltSize];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(salt);
        return salt;
    }

    private static byte[] GenerateHash(string password, byte[] salt)
    {
        using var pbkdf2 = new Rfc2898DeriveBytes(password, salt, Iterations, HashAlgorithmName.SHA256);
        return pbkdf2.GetBytes(HashSize);
    }
}