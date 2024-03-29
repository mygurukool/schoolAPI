const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const userSchema = mongoose.Schema(
  {
    organizationId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: false,
    },
    name: {
      type: String,
      required: false,
    },
    mobile: {
      type: Number,
      required: false,
    },
    email: {
      type: String,
      required: false,
      unique: true,
      trim: true,
      lowercase: true,
    },
    imageUrl: {
      type: String,
      required: false,
    },

    loginTypes: [
      {
        id: {
          type: String,
          required: true,
        },
        platformName: {
          type: String,
          required: true,
        },
      },
    ],
    password: {
      type: String,
      required: false,
      minlength: 8,
      default: null,
    },
    country: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    state: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      required: false,
    },
    permissions: {
      type: Array,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(toJSON);
userSchema.plugin(paginate);

const User = mongoose.model("User", userSchema);

module.exports = User;
