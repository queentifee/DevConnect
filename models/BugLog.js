const mongoose = require ("mongoose");

const BugLogSchema = new mongoose.Schema ({
     user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
          title: {
      type: String,
      required: [true, "Please add a title"],
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    cause: {
      type: String,
    },
    solution: {
      type: String,
      required: [true, "Please explain how you solved it"],
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);



module.exports = mongoose.model ("BugLog", BugLogSchema);