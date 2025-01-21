using LeoAuth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AuthDemoApi.Controller;

[Authorize]
[ApiController]
[Route("api/demo")]
public sealed class DemoController : ControllerBase
{
    // Note: route names do not follow rest conventions - demo purposes only

    [HttpGet]
    // the Authorize attribute of the controller is applied
    [Route("at-least-logged-in")]
    public IActionResult GetIfAtLeastLoggedIn() => Ok("You are at least logged in");

    [HttpGet]
    // Note: test users are treated like students
    [Authorize(nameof(LeoUserRole.Student))]
    [Route("at-least-student")]
    public IActionResult GetIfAtLeastStudent() => Ok("You are at least a student");

    [HttpGet]
    [Authorize(nameof(LeoUserRole.Teacher))]
    [Route("is-teacher")]
    public IActionResult GetIfTeacher() => Ok("You are a teacher");

    [HttpGet]
    [AllowAnonymous]
    [Route("everyone-allowed")]
    public IActionResult GetInAnyCase() => Ok("Everyone is allowed to see this");

    [HttpGet]
    // the Authorize attribute of the controller is applied
    [Route("token-data")]
    public ActionResult<List<string>> GetTokenData()
    {
        var userInfo = HttpContext.User.GetLeoUserInformation();

        return userInfo.Match<ActionResult<List<string>>>(user => Ok(GetUserInfo(user)),
                                                          _ => NotFound());
    }

    private static List<string> GetUserInfo(LeoUser user)
    {
        List<string> data = [];

        user.Username.Switch(username => data.Add($"Username: {username}"),
                             _ => { });

        var name = user.Name.Match(fullName => fullName.Name,
                                   firstNameOnly => firstNameOnly.FirstName,
                                   lastNameOnly => lastNameOnly.LastName,
                                   _ => string.Empty);
        if (!string.IsNullOrEmpty(name))
        {
            data.Add($"Name: {name}");
        }

        user.Department.Switch(department => data.Add($"Department: {department.Name}"),
                               _ => { });

        string? role = null;
        if (user.IsStudent)
        {
            role = "Student";
        }
        else if (user.IsTeacher)
        {
            role = "Teacher";
        }
        else if (user.IsTestUser)
        {
            role = "Test User";
        }

        if (role != null)
        {
            data.Add($"Role: {role}");
        }

        return data;
    }
}
