const GOOGLE_API = 'https://classroom.googleapis.com/v1/'
const MS_API = ' https://classroom.googleapis.com/v1/'

const REACT_APP_GOOGLE_OAUTH_SCOPES =
    "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/classroom.courses.readonly https://www.googleapis.com/auth/classroom.coursework.me https://www.googleapis.com/auth/classroom.rosters.readonly https://www.googleapis.com/auth/drive";

const REACT_APP_GOOGLE_OAUTH_TUTOR_SCOPES = "https://www.googleapis.com/auth/classroom.coursework.students https://www.googleapis.com/auth/classroom.courses https://www.googleapis.com/auth/classroom.coursework.students https://www.googleapis.com/auth/classroom.rosters";

const DATETIMEFORMAT = 'DD/MM/YYYY HH:mm';


module.exports = { GOOGLE_API, MS_API, REACT_APP_GOOGLE_OAUTH_SCOPES, REACT_APP_GOOGLE_OAUTH_TUTOR_SCOPES, DATETIMEFORMAT }

