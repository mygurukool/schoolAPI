const catchAsync = require('../utils/catchAsync');
const { invitationService } = require('../services');

const getInvitation = catchAsync(async (req, res) => {
    const result = await invitationService.getInvitation(req.query.id);
    return res.status(result.status).send(result);
});

const sendInvitation = catchAsync(async (req, res) => {
    const result = await invitationService.sendInvitation(req.body);
    return res.status(result.status).send(result);
});

const acceptInvitation = catchAsync(async (req, res) => {
    const result = await invitationService.acceptInvitation(req.body);
    return res.status(result.status).send(result);
});


module.exports = {
    sendInvitation, getInvitation, acceptInvitation
};