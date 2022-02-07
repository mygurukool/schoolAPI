const httpStatus = require('http-status');
const { Events } = require('../models');
const moment = require('moment');
const { sendNotifications } = require('./notification.service');

const all = async (req) => {
    try {
        console.log('start', moment(req.query.start).startOf('day').toDate(), 'end', moment(req.query.end).endOf('day').toDate());
        const events = await Events.find({
            $or: [
                { createdBy: req.userId },
                { students: { $in: [req.userId] } },
                { teachers: { $in: [req.userId] } },
            ],
            start: {
                $gte: moment(req.query.start).startOf('day').toDate(),
            },
            end: {
                $lte: moment(req.query.end).endOf('day').toDate(),
            },
        })
        // console.log('events', events);
        return ({ status: httpStatus.OK, data: events });
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Failed to create organization" });

    }

}

const create = async (req) => {
    try {
        const added = await Events.create({ ...req.body, createdBy: req.userId, })
        let notifiedUsers = []
        console.log('added', added);
        if (added.students.length > 0) {
            await Promise.all(added.students.map(s => {
                notifiedUsers.push(s)
            }))
        }
        if (added.teachers.length > 0) {

            await Promise.all(added.teachers.map(s => {
                notifiedUsers.push(s)
            }))
        }
        console.log('notifiedUsers', notifiedUsers);
        await sendNotifications({ title: `A new event added for ${req.body.title}`, data: { time: JSON.stringify(new Date()) }, users: notifiedUsers })
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

module.exports = {
    all, create, update, remove
}
