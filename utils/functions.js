const httpStatus = require("http-status");
const fs = require("fs");
const platforms = require("./platforms");
const { ObjectId } = require("mongodb");
// const Jimp = require('jimp');

const findUserInArray = ({ data = [], userId }) => {
  return data.some((d) => {
    return JSON.stringify(d) === JSON.stringify(userId);
  });
};

const findGoogleToken = async ({ tokens }) => {
  const found = tokens.filter((d) => d.platformName === platforms.GOOGLE);
  if (found.length > 0) {
    return found[0].token;
  } else {
    return null;
  }
};

const statusCheck = (status) => {
  return status ? { status: true } : {};
};
const getCourseIcons = async (courseName) => {
  const dir = "uploaded/course_icons/";

  let subjectIcon = `default.jpg`;
  const files = await fs.promises.readdir(dir);
  // console.log('files', files);
  files.forEach((icon) => {
    // console.log(icon);
    let lastIndexOfbackSlash = icon.lastIndexOf("/");
    let regex = new RegExp(courseName.toLowerCase(), "i");
    if (
      courseName
        .toLowerCase()
        .includes(
          icon.substring(
            lastIndexOfbackSlash + 1,
            icon.indexOf(".", lastIndexOfbackSlash)
          )
        )
    ) {
      subjectIcon = icon;
    }
  });
  return dir + subjectIcon;
};
// const compressImages = async (file) => {
//     console.log('file', file);

//     const ref = __dirname.replace('utils', '') + file.path
//     const output = __dirname.replace('utils', '') + file.destination + '/' + 'preview' + '.jpg'
//     console.log(ref);
//     console.log('preview', __dirname.replace('utils', '')
//         + file.destination + '/' + 'preview' + Date.now() + '.jpg');
//     await Jimp.read(ref, (err, lenna) => {
//         if (err) throw err;
//         lenna
//             .resize(256, 256) // resize
//             .quality(60)
//             .write(output); // save
//     });

//     console.log('file.destination + ref', ref);
//     return ref
// }

const getFilesData = async (files) => {
  // console.log('file', files);
  if (files) {
    if (typeof files === "object") {
      if (files.length > 0) {
        let images = [];
        await files.map(async (file) => {
          // const fileName = compressImages(file)
          const fileName = file.destination + "/" + file.filename;
          images.push(fileName);
        });
        return images;
      } else if (files.destination) {
        // return compressImages(files)
        return files.destination + "/" + files.filename;
      }
    } else {
      // return compressImages(files)
      return files.destination + "/" + files.filename;
    }
  }
};

const removeFile = (file) => {
  if (typeof file === "object") {
    if (file.length > 0) {
      file.map((f) => {
        if (fs.existsSync(f)) {
          fs.unlink(f, (err) => {
            if (err) {
              return { status: httpStatus.INTERNAL_SERVER_ERROR, message: err };
            }
          });
        }
      });
    }
  } else {
    if (fs.existsSync(file)) {
      fs.unlink(file, (err) => {
        if (err) {
          return { status: httpStatus.INTERNAL_SERVER_ERROR, message: err };
        }
      });
    }
  }
};

module.exports = {
  getFilesData,
  removeFile,
  statusCheck,
  findUserInArray,
  findGoogleToken,
  getCourseIcons,
};
