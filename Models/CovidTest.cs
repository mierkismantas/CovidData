using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CovidApi.Models
{
    public class CovidTest
    {
        public CovidTest()
        {
        }

        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [Key]
        public int Id { get; set; }

        public string XCoordinate { get; set; }
        public string YCoordinate { get; set; }
        public string CaseCode { get; set; }
        public DateTime ConfirmationDate { get; set; }
        public string MunicipalityCode { get; set; }
        public string MunicipalityName { get; set; }
        public string AgeBracket { get; set; }
        public string Gender { get; set; }

        public void SetAllStringNullPropertiesToStringEmpty()
        {
            foreach (var propertyInfo in GetType().GetProperties())
            {
                if (propertyInfo.PropertyType == typeof(string))
                {
                    if (propertyInfo.GetValue(this, null) == null)
                    {
                        propertyInfo.SetValue(this, string.Empty, null);
                    }
                }
            }
        }
    }
}
