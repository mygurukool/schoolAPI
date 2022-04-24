const httpStatus = require("http-status");
const config = require("../config/config");
const Invitation = require("../models/invitation.model");
const sgMail = require("@sendgrid/mail");
const { User, Group } = require("../models");
const bcrypt = require("bcryptjs");
const emailTemplate = require("../utils/emailTemplate");
const platforms = require("../utils/platforms");

const checkInvitationEmail = async ({ invitationId, email }) => {
  try {
    console.log("checkinvitationemail", invitationId, email);
    const invitation = await Invitation.find({
      _id: invitationId,
      peoples: email,
    });
    if (invitation.length === 0) {
      return {
        status: httpStatus.NOT_FOUND,
        message: "No invitations found for this email",
      };
    }
    const findUser = await User.findOne({ email: email });

    return {
      status: httpStatus.OK,
      data: { isUserExist: findUser ? true : false },
    };
  } catch (error) {
    console.log(error);
    return {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to get invitations",
    };
  }

  // try {
  //   const invitation = await Invitation.findById(id);
  //   return { status: httpStatus.OK, data: { ...invitation._doc, peoples: [] } };
  // } catch (error) {
  // console.log(error);
  // return {
  //   status: httpStatus.INTERNAL_SERVER_ERROR,
  //   message: "Failed to get invitations",
  // };
  // }
};

const getInvitation = async (id) => {
  try {
    const invitation = await Invitation.findById(id);
    return { status: httpStatus.OK, data: { ...invitation._doc, peoples: [] } };
  } catch (error) {
    console.log(error);
    return {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to get invitations",
    };
  }
};

const sendInvitation = async (data) => {
  console.log("createInvitation", data);
  try {
    if (!config.email.sendgrid_api_key) {
      return {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: "No Api key found",
      };
    }
    const createInvitation = await Invitation.create(data);

    sgMail.setApiKey(config.email.sendgrid_api_key);
    const invitationLink = `https://mougli.school/invitation/${data.type}/${createInvitation._id}`;
    let mailDetails = {
      from: config.email.from,
      to: createInvitation.peoples,
      subject: "Mygurukool Invitation",
      html: emailTemplate(data, invitationLink),
    };
    try {
      await sgMail.sendMultiple(mailDetails);
    } catch (error) {
      // return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error.response.body.errors[0].message });
    }

    return {
      status: httpStatus.OK,
      data: invitationLink,
      message: "Invitation sent successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to sent invitations",
    };
  }
};

const acceptInvitation = async (data) => {
  console.log("accept invitation", data);
  const invitationId = data.invitation._id || data.invitation.id;
  const isUserExist = data.isUserExist;

  try {
    const invitation = await Invitation.findById(invitationId);
    console.log("invitation", invitation);
    if (!invitation) {
      return {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: "No invitation found",
      };
    }
    const emailExist = await invitation.peoples.includes(data.userData.email);
    if (!emailExist) {
      return {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: "No invitation found for this email",
      };
    }
    if (!isUserExist) {
      const salt = await bcrypt.genSalt(10);

      const hashPassword = await bcrypt.hash(data.userData.password, salt);
      const createdUser = await User.create({
        organizations: [invitation.organizationId],
        groups: [
          { groupId: invitation.groupId, role: invitation.type.toUpperCase() },
        ],
        name: data.userData.name,
        email: data.userData.email,

        password: hashPassword,
        role: data.invitation.role,
      });
      if (!createdUser) {
        return {
          status: httpStatus.INTERNAL_SERVER_ERROR,
          message: "Failed ",
        };
      } else {
        const updateUser = await User.findByIdAndUpdate(createdUser._id, {
          loginTypes: [
            { userId: createdUser._id, platformName: platforms.MOUGLI },
          ],
        });
        const updatedGroup = await Group.findByIdAndUpdate(invitation.groupId, {
          $push: { users: updateUser.id },
        });
        return { status: httpStatus.OK, message: "Invitation accepted" };
      }
    } else {
      const findUser = await User.findOne({ email: data.userData.email });
      if (
        findUser &&
        (await bcrypt.compare(data.userData.password, findUser.password))
      ) {
        const updatedGroup = await Group.findByIdAndUpdate(invitation.groupId, {
          $push: { users: invitation.groupId },
        });

        console.log("updatedGroups", updatedGroup);
        const updatedUser = await User.findByIdAndUpdate(findUser._id, {
          $addToSet: { organizations: [invitation.organizationId] },
          $push: {
            groups: [
              {
                groupId: invitation.groupId,
                role: invitation.type.toUpperCase(),
              },
            ],
          },
        });

        if (updatedUser) {
          return { status: httpStatus.OK, message: "Invitation accepted" };
        }
      }
    }

    // const salt = await bcrypt.genSalt(10);

    // const hashPassword = await bcrypt.hash(data.password, salt);
    // const checkUser = await User.findOne({ email: data.email });

    // if (!checkUser) {
    // const createdUser = await User.create({
    //   organizationId: invitation.organizationId,
    //   groupId: invitation.groupId,
    //   name: data.name,
    //   email: data.email,

    //   password: hashPassword,
    //   role: data.role,
    // });
    //   if (data.role === "TEACHER") {
    //     await Group.findByIdAndUpdate(invitation.groupId, {
    //       $push: {
    //         teachers: createdUser.id || createdUser._id,
    //         users: createdUser.id || createdUser._id,
    //       },
    //     });
    //   } else {
    //     await Group.findByIdAndUpdate(invitation.groupId, {
    //       $push: {
    //         students: createdUser.id || createdUser._id,
    //         users: createdUser.id || createdUser._id,
    //       },
    //     });
    //   }
    // } else {
    //   if (data.role === "TEACHER") {
    //     await Group.findByIdAndUpdate(invitation.groupId, {
    //       $push: {
    //         teachers: checkUser.id || checkUser._id,
    //         users: checkUser.id || checkUser._id,
    //       },
    //     });
    //   } else {
    //     await Group.findByIdAndUpdate(invitation.groupId, {
    //       $push: {
    //         students: checkUser.id || checkUser._id,
    //         users: checkUser.id || checkUser._id,
    //       },
    //     });
    //   }
    // }
    // return { status: httpStatus.OK, message: "Invitation accepted" };
  } catch (error) {
    console.log(error);
    return {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to get invitations",
    };
  }
};

module.exports = {
  getInvitation,
  sendInvitation,
  acceptInvitation,
  checkInvitationEmail,
};
