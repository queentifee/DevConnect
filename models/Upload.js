const mongoose = require ('mongoose');

const fileSchema = new mongoose.Schema({
  filename: String,
  url: String,
  resource_type: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
email:  String,
user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

});

module.exports= mongoose.model('File', fileSchema);
