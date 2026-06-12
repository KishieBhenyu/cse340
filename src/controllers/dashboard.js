const volunteerProjects =
    await volunteerModel.getVolunteerProjects(user.user_id);

res.render("account/dashboard", {
    title: "Dashboard",
    volunteerProjects
});