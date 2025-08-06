const cloudinary = require ("../utils/cloudinary");
const File = require  ("../models/Upload.js");
const fs = require ('fs');
const User = require ('../models/Users');


exports.uploadFile = async (req, res) => {
    try {
        const email = req.user?.email || req.body?.email;
         if (!email) {
      return res.status(400).json({ message: 'Missing email from token or body' });
    };
        let user = await User.findOne({ email });
 if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    };
    const filePath = req.file.path;

    const result = await cloudinary.uploader.upload(filePath, {
      folder: `DevConnect`,
      resource_type: 'auto',
    });

    fs.unlinkSync(filePath); // delete temp file

    const filePayload = {
  filename: req.file.originalname,
  url: result.secure_url,
  resource_type: result.resource_type,
  email,
  user: user._id, // ✅ attach user here

};
const savedFile = await File.create(filePayload);

// filePayload.user = user._id;

//Add file to user's file array

await User.findByIdAndUpdate(user._id, { $push: { files: savedFile._id } });
    res.status(201).json({ success: true, file: savedFile});

    } catch (err) {
        console.error('Upload error:', err);
    res.status(500).json({ success: false, message: err.message });
    }
};
