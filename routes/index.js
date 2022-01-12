const express = require('express');
const router = express.Router();
const auth = require('./auth.route')
const organization = require('./organization.route')
const courses = require('./courses.route')
const chat = require('./chat.route')
const group = require('./group.route')
const assignment = require('./assignment.route')
const invitation = require('./invitation.route')
const user = require('./user.route');
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const config = require('../config/config');
const Grid = require('gridfs-stream');

const connection = mongoose.createConnection(config.mongoose.url);

// Init gfs
let gfs;
const image_bucket_name = "photos"

connection.once('open', () => {
    // Init stream
    gfs = Grid(connection.db, mongoose.mongo);
    gfs.collection(image_bucket_name);
})

router.get('/test', (req, res) => {
    res.send('Hello')
})
router.get('/image/:id', (req, res) => {
    const id = req.params.id
    gfs.files.find({ filename: id }).toArray(function (err, files) {
        const file = files[0]
        // console.log(file);

        res.contentType(file.contentType)
        var readStream = gfs.createReadStream({ _id: ObjectId(file._id) })
        readStream.on('data', (chunk) => {
            res.write(chunk)
        })
        readStream.on('end', (chunk) => {
            res.end()
        })
    })
})

router.use('/auth', auth)
router.use('/organization', organization)
router.use('/course', courses)
router.use('/chat', chat)
router.use('/group', group)
router.use('/assignment', assignment)
router.use('/invite', invitation)
router.use('/user', user)

module.exports = router;