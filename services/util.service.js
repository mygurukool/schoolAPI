const httpStatus = require('http-status');

const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const config = require('../config/config');
const Grid = require('gridfs-stream');
const ogs = require('open-graph-scraper');
const connection = mongoose.createConnection(config.mongoose.url);

// let gfs;
// const image_bucket_name = "files"

// connection.once('open', () => {
//     // Init stream
//     gfs = Grid(connection.db, mongoose.mongo);
//     gfs.collection(image_bucket_name);
// })

const getImage = async (req, res) => {
    try {
        const { id, type } = req.params
        let downloadStream = bucket.openDownloadStream(ObjectId(id));
        if (type == 'view') {
            bucket.find({ _id: ObjectId(id) }).toArray(function (err, files) {
                const file = files[0]
                // console.log(file);

                res.contentType(file.contentType)
                // var downloadStream = bucket.createReadStream({ _id: ObjectId(file._id) })
                downloadStream.on('data', (chunk) => {
                    res.write(chunk)
                })
                downloadStream.on('end', (chunk) => {
                    res.end()
                })
            })
        } else {
            bucket.find({ _id: ObjectId(id) }).toArray(function (err, files) {
                const file = files[0]
                console.log(file);

                res.contentType(file.contentType)
                res.set('Content-Disposition', 'attachment; filename="' + file.filename + '"');
                // var readStream = bucket.createReadStream({ _id: ObjectId(file._id) })

                downloadStream.on('end', (chunk) => {
                    res.end()
                })
                downloadStream.pipe(res);
            })
        }
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Failed to get file" });

    }

}

const validURL = (url) => {
    var pattern = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/
    return pattern.test(url)
}


const getMetadata = async (req) => {
    try {
        const url = req.body.url
        if (!validURL(url)) {
            return { status: httpStatus.INTERNAL_SERVER_ERROR, error: "Invalid URL" }
        }
        const options = { url: url };
        const result = await ogs(options, (error, results, response) => {
            return results;
        });

        if (!result.success) {
            return {
                ogTitle: url,
                ogUrl: url
            }
        }
        return result
    } catch (error) {
        console.log(error);
        return err
    }
}


module.exports = {
    getImage, getMetadata
}
