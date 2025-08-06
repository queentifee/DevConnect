const BugLog = require('../models/BugLog');



exports.CreateLog = async (req, res) => {
    const { title, description, cause, solution, tags } = req.body;

    try {
        const bugLog = new BugLog ({
            user: req.user._id,
            title, 
            description,
            cause,
            solution,
            tags,
        });

        await bugLog.save();

        res.status(201).json ({
            message: "New Buglog successfully created",
            bugLog
        });
        
    } catch (error) {
        res.status(500).json ({
            message: "Server error",
            error: error.message
        });      
    }
};

exports.getAllLogs = async (req, res) => {
    try {
        const buglogs = await BugLog.find().populate("user", "name email");
        res.json ({
            message: "All Bug logs retrieved",
            buglogs
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message});    
    }
};

exports.paginatedLogs = async (req, res) => {
  const { page = 1, limit = 10, search = "", tags = "" } = req.query;

  const searchRegex = new RegExp(search, "i");
  const tagArray = tags ? tags.split(",").map(tag => tag.trim()) : [];

  const query = {
    $and: [
        {
            $or: [
                { title: { $regex: searchRegex } },
                { description: { $regex: searchRegex } },
                { tags: { $regex: searchRegex } }
            ],
        },
        ...(tagArray.length > 0 ? [{ tags: { $in: tagArray } }] : []),
    ],
  };

  try {
    const bugLogs = await BugLog.find(query)
    .populate("user", "name email")
    .skip((page -1) * limit)
    .limit(parseInt(limit));

    const total = await BugLog.countDocuments(query);

    res.json ({
        message: "Bug Logs retrieved",
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        bugLogs,
    })
    
  } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });   
  }
};


exports.getByID = async (req, res) => {
    try {
        const bugLog = await BugLog.findById(req.params.id).populate("user", "name email");

        if (!bugLog) {
          return  res.status(404).json ({ message: "Log not found" });
        };

        res.json({
            message: "Bug log retrieved successfully",
            bugLog
        })
    } catch (error) {
        res.status(500).json ({ message: "Server error", error: error.message });    
    }
};

exports.getUserLog = async (req, res) => {
    try {
        const bugLogs = await BugLog.find ({ user: req.params.userId }).sort ({ createdAt: -1});

        res.json({
            message: "All logs retrieved successfully",
            bugLogs
        })
    } catch (error) {
    res.status(500).json ({ message: "Server error", error: error.message });    
    }
}

exports.Update = async (req, res) => {
    try {
        const bugLog = await BugLog.findById(req.params.id);

        if (!bugLog) {
           return res.status(404).json ({ message: "Log not found" });
        };

        if (bugLog.user.toString()  !== req.user._id.toString()) {
           return res.status(403).json ({ message: "Unauthorized" });
        }

        const updatedFields = ["title", "description", "cause", "solution", "tags"];
    updatedFields.forEach((field) => {
      if (req.body[field]) bugLog[field] = req.body[field];
    });

    await bugLog.save();

    res.json ({
        message: "Log updated successfully",
        bugLog
    });

} catch (error) {
res.status(500).json ({ message: "Server error", error: error.message });    
}
};

exports.Delete = async (req, res) => {
    try {
        const bugLog = await BugLog.findById(req.params.id);

        if (!bugLog) {
           return res.status(404).json ({ message: "Log not found" });
        };

        if (bugLog.user.toString()  !== req.user._id.toString()) {
           return res.status(403).json ({ message: "Unauthorized" });
        }   

    await bugLog.deleteOne();

    res.json ({
        message: "Log deleted successfully",
        bugLog
    });

} catch (error) {
res.status(500).json ({ message: "Server error", error: error.message });    
}
};