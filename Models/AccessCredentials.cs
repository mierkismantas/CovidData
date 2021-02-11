using CovidApi.Extensions;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CovidApi.Models
{
    public class AccessCredentials
    {
        public AccessCredentials()
        {
        }

        public AccessCredentials(int id, string userName, string password)
        {
            Id = id;
            UserName = userName;

            //todo: base64 should be changed with something more sophisticated
            Password = password.Base64Encode();
        }

        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [Key]
        public string UserName { get; set; }

        public string Password { get; set; }
        public int Id { get; set; }
    }
}
