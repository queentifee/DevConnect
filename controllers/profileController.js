const Profile = require ('../models/Profile');
const User = require ('../models/Users')

exports.createOrUpdateProfile = async (req, res) => {
    const { bio, skills, projects, currentRole } = req.body;

    if (!skills || skills.length === 0) {
        return res.status(400).json({ message: "Skills are required"});
    }

    const profileFields = {
        user: req.user._id,
        bio,
        projects,
        currentRole,
       skills: Array.isArray(skills) ? skills : skills.split(',').map(skill => skill.trim()),
    }

    try {
     
        let profile = await Profile.findOne({ user: req.user.id });

        if (profile) {
            profile = await Profile.findOneAndUpdate (
                { user: req.user._id},
                { $set: profileFields},
                { new: true}
            );
        } else {
            profile = new Profile(profileFields);
            await profile.save();

             await User.findByIdAndUpdate(req.user._id, {
    profile: profile._id
      })

        }
        res.json({
            message: "Profile Updated Successfully",
            profile
        })
    } catch (error) {
        res.status(500).json ({ message: 'Server error', error: error.message})
    }
};

exports.getProfile = async (req, res) => {
    try {
        const profile = await Profile.findOne ({ user: req.user._id}).populate('user', ['name', 'email']);

        if (!profile) return res.status(404).json ({ message: "Profile not found"});
        res.json({
          message: "Profile retrieved",
          profile
    });
    } catch (error) {
     res.status(500).json({ message: 'Server error', error: error.message });

    }
};

exports.getAllProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find()
    .populate('user', ['name', 'email', 'currentRole'])
    .sort({ createdAt: -1})
    ;
res.json({
          message: "All Profiles retrieved",
          profiles
    });  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getPaginatedProfile = async (req, res) => {
try {

  const { page = 1, limit = 10, search = "", skills } = req.query;

  const query = {};

  if (search) {
    query.$or = [
      { bio: {$regex: search, $options: "i"} },
      { currentRole: { $regex: search, $options: "i" } },

    ];

  }

  if (skills) {
    const skillsArray = skills.split(",").map((skill) => skill.trim());
    query.skills = { $in: skillsArray };
  }

  const total = await Profile.countDocuments(query);

  let profiles = await Profile.find(query)
    .populate("user", "name, email")
    .skip((page -1) * limit)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

    if (search) {
      profiles = profiles.filter((p) =>
      p.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.bio?.toLowerCase().includes(search.toLowerCase()) ||
       p.currentRole?.toLowerCase().includes(search.toLowerCase())

      );
    }
  
res.json({
      message: "Developer profiles fetched",
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalProfiles: total,
      profiles,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch profiles",
      error: error.message,
    });
  }
}


// @desc Get profile by user ID
exports.getProfileByUserId = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.userId }).populate('user', ['name', 'email']);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.followProfile = async (req, res) => {
  try {
    const targetProfile = await Profile.findById(req.params.id);
    if (!targetProfile) {
      return res.status(404).json({ message: "Target profile not found" });
    }

    // Prevent self-follow: req.user._id is the follower
    if (targetProfile.user.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "Can't connect with yourself" });
}

const currentUserProfile = await Profile.findOne({ user: req.user._id });
if (!currentUserProfile) {
      return res.status(404).json({ message: 'Your profile not found' });
    }

    //Already connected?
    if (targetProfile.followers.some(id => id.toString() === req.user._id.toString())) {
            return res.status(400).json({ message: 'Already following this developer' });
    }

    targetProfile.followers.push(req.user._id);
    currentUserProfile.following.push(targetProfile.user); // following stores user ids being followed

    await targetProfile.save();
    await currentUserProfile.save();

     res.json({
      message: 'Followed successfully',
      targetProfile: {
        id: targetProfile._id,
        followersCount: targetProfile.followers.length,
      },
      yourProfile: {
        id: currentUserProfile._id,
        followingCount: currentUserProfile.following.length,
      },
    });
  } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });

  }
};

exports.unfollowProfile = async (req, res) => {
  try {
    const targetProfile = await Profile.findById(req.params.id);
    if (!targetProfile) {
      return res.status(404).json({ message: 'Target profile not found' });
    }

    if (targetProfile.user.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "Can't unfollow yourself" });
    }

    const currentUserProfile = await Profile.findOne({ user: req.user._id });
    if (!currentUserProfile) {
      return res.status(404).json({ message: 'Your profile not found' });
    }

    // Not following?
    if (!targetProfile.followers.some(id => id.toString() === req.user._id.toString())) {
      return res.status(400).json({ message: "You don't follow this developer" });
    }

    // Remove follower & following
    targetProfile.followers = targetProfile.followers.filter(
      id => id.toString() !== req.user._id.toString()
    );
    currentUserProfile.following = currentUserProfile.following.filter(
      id => id.toString() !== targetProfile.user.toString()
    );

    await targetProfile.save();
    await currentUserProfile.save();

    res.json({
      message: 'Unfollowed successfully',
      targetProfile: {
        id: targetProfile._id,
        followersCount: targetProfile.followers.length,
      },
      yourProfile: {
        id: currentUserProfile._id,
        followingCount: currentUserProfile.following.length,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};