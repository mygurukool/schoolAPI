const httpStatus = require('http-status');
const { Events, User } = require('../models');
const moment = require('moment');
const { sendNotifications } = require('./notification.service');

const all = async (req) => {
    try {
        console.log('start', moment(req.query.start).startOf('day').toDate(), 'end', moment(req.query.end).endOf('day').toDate());
        const events = await Events.find({
            $or: [
                { createdBy: req.userId },
                { 'users.id': { $in: [req.userId] } },
            ],
            start: {
                $gte: moment(req.query.start).startOf('day').toDate(),
            },
            end: {
                $lte: moment(req.query.end).endOf('day').toDate(),
            },
        })
        // console.log('events', events);
        const newEvents = await Promise.all(events.map(async e => {
            const users = await Promise.all(e.users.map(async u => {
                console.log('u.id', u.id);
                const userdata = await User.findById(u.id)
                if (userdata) {
                    delete userdata.permissions
                    delete userdata.password
                    return { ...u._doc, ...userdata._doc }
                }
            }))
            return { ...e._doc, users: users.filter(u => Boolean(u)) }
        }))
        return ({ status: httpStatus.OK, data: newEvents });
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Failed to create organization" });

    }

}

const create = async (req) => {
    try {
        console.log('req.body', req.body);
        const users = await Promise.all(req.body.users.map(u => {
            return { id: u, status: 'Pending' }
        }))
        const added = await Events.create({ ...req.body, users: users, createdBy: req.userId, })
        // let notifiedUsers = []
        // console.log('added', added);
        // if (added.users.length > 0) {
        //     await Promise.all(added.users.map(s => {
        //         notifiedUsers.push(s.id)
        //     }))
        // }
        // console.log('notifiedUsers', notifiedUsers);
        // await sendNotifications({ title: `A new event added for ${req.body.title}`, data: { time: JSON.stringify(new Date()) }, users: notifiedUsers })
        return ({ status: httpStatus.OK, message: "Events created successfully" });
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Failed to create organization" });

    }

}

const update = async (data) => {
    try {
        await Events.findByIdAndUpdate(data.id || data._id, data)
        return ({ status: httpStatus.OK, message: "Events updated successfully" });
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Failed to update " });

    }
}

const remove = async (data) => {
    try {
        await Events.findByIdAndDelete(data.id || data._id)
        return ({ status: httpStatus.OK, message: "Events deleted successfully" });
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Failed to delete group" });

    }
}

const changeStatus = async (req) => {
    try {
        console.log('req.body', req.body);

        await Events.updateOne({ 'users.id': req.body.userId, _id: req.body.eventId }, {
            $set: {
                'users.$.status': req.body.status,
            }
        })
        return ({ status: httpStatus.OK, message: req.body.status });
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Failed" });

    }

}

module.exports = {
    all, create, update, remove, changeStatus
}
