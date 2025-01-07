using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;
using Swashbuckle.AspNetCore.Filters;

namespace api.Swaggerhub
{
    public class UserRegisterExample : IExamplesProvider<User>
    {
        public User GetExamples()
        {
            return new User 
            {
                email = "example@example.com",
                username = "example_user",
                password = "ExamplePassword123!",
                first_name = "Jane",
                last_name = "Doe",
                profile_picture_url = "localhost",
                bio = "Text Bio"
            };
        }
    }
}