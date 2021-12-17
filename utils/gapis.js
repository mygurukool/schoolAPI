const userApis = {
    getDetails: (userId) => `userProfiles/${userId}`
}
const courseApis = {
    getCourses: () => `courses`,
    getAssignments: (courseId) => `courses/${courseId}/courseWork`,
    getCourseTeachers: (courseId) => `courses/${courseId}/teachers`,
    getCourseStudents: (courseId) => `courses/${courseId}/students`,
}

module.exports = { userApis, courseApis }