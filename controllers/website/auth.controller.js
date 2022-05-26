const catchAsync = require('../../utils/catchAsync');
const { authService } = require('../../services/website');

const login = catchAsync(async (req, res) => {
    const result = await authService.login(req.body);
    return res.status(result.status).send(result)
})

const register = catchAsync(async (req, res) => {
    const result = await authService.register(req.body);
    return res.status(result.status).send(result)
})

const update = catchAsync(async (req, res) => {
    const result = await authService.update(req.body);
    return res.status(result.status).send(result)
})

const details = catchAsync(async (req, res) => {
    const result = await authService.details(req);
    return res.status(result.status).send(result)
})
const registerAdmin = catchAsync(async (req, res) => {
    const result = await authService.registerAdmin(req.body);
    return res.status(result.status).send(result)
})


module.exports = {
    login,
    details,
    register,
    update,
    registerAdmin
};