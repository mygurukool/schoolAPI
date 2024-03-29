const httpStatus = require('http-status');
const { GroupChat } = require('../models');

const userGroups = async (data) => {
    try {
        const checkGroup = await GroupChat.find({ assignmentId: data.assignmentId })
        // console.log('checkGroup', checkGroup);

        const filteredGroups = await Promise.all(checkGroup.filter(g => {
            const found = g.users.find(u => { return u.id === data.userId })
            // console.log('found', found, g.users)
            if (found) {
                return true
            }
            else { return false }
        }))
        // console.log('filteredGroups', filteredGroups);
        return ({ status: httpStatus.OK, data: filteredGroups });
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Failed to get user groups" });

    }

}


module.exports = {
    userGroups
}
