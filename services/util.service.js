const httpStatus = require('http-status');

const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const config = require('../config/config');
const Grid = require('gridfs-stream');
const ogs = require('open-graph-scraper');
const connection = mongoose.createConnection(config.mongoose.url);

let gfs;
const image_bucket_name = "files"

connection.once('open', () => {
    // Init stream
    gfs = Grid(connection.db, mongoose.mongo);
    gfs.collection(image_bucket_name);
})

const getImage = async (req, res) => {
    try {
        const { id, type } = req.params

        if (type == 'view') {
            gfs.files.find({ _id: ObjectId(id) }).toArray(function (err, files) {
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
        } else {
            gfs.files.find({ _id: ObjectId(id) }).toArray(function (err, files) {
                const file = files[0]
                console.log(file);

                res.contentType(file.contentType)
                res.set('Content-Disposition', 'attachment; filename="' + file.filename + '"');
                var readStream = gfs.createReadStream({ _id: ObjectId(file._id) })

                readStream.on('end', (chunk) => {
                    res.end()
                })
                readStream.pipe(res);
            })
        }
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Failed to get file" });

    }

}


const getMetadata = async (req) => {
    try {
        const options = { url: req.body.url };
        await ogs(options, (error, results, response) => {
            return results;
        });
    } catch (error) {
        console.log(error);
        return err
    }
}


module.exports = {
    getImage, getMetadata
}
