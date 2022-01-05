const catchAsync = require('../utils/catchAsync');
const { authService } = require('../services');
const { array } = require('joi');

const login = catchAsync(async (req, res) => {
    const result = await authService.login(req);
    return res.status(result.status).send(result)
})

const sendloginotp = catchAsync(async (req, res) => {
    const result = await authService.sendloginotp(req.body);
    return res.status(result.status).send(result)
})

const details = catchAsync(async (req, res) => {
    const result = await authService.details(req);
    return res.status(result.status).send(result)
})

const socialLogin = catchAsync(async (req, res) => {
    const result = await authService.socialLogin(req.body);
    return res.status(result.status).send(result);
});

// const forgotPassword = catchAsync(async (req, res) => {
//     const result = await authService.forgotPassword(req.body);
//     return res.status(result.status).send(result);
// });

module.exports = {
    login,
    details,
    socialLogin,
    // forgotPassword,
    sendloginotp
};