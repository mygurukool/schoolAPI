const userApis = {
    getDetails: (userId) => `userProfiles/${userId}`
}
const courseApis = {
    getCourses: () => `courses`,
    getAssignments: (courseId) => `courses/${courseId}/courseWork`
}

module.exports = { userApis, courseApis }