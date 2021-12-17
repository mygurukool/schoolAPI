const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const groupChatSchema = mongoose.Schema(
  {
    roomId: {
      type: String,
      required: false,
    },
    assignmentId: {
      type: String,
      required: false,
    },
    users: {
      type: Array,
      required: false,
    },
    messages: {
      type: Array,
      required: false,
    }
  },
  {
    timestamps: true,
  }
);


groupChatSchema.plugin(toJSON);
groupChatSchema.plugin(paginate);

const GroupChat = mongoose.model('GroupChat', groupChatSchema);

module.exports = GroupChat;
