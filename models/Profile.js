const mongoose = require ("mongoose");


const profileSchema = new mongoose.Schema ({
     user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bio: { type: String, maxlenght: 500 },
    skills: { type: [String], required: true },
    currentRole: { type: [String], required: true },
    projects: [
      {
        title: { type: String, required: true },
        description: String,
        link: String,
      },
    ],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

}, 
    
{ timeStamps: true }
);


module.exports = mongoose.model('Profile', profileSchema)