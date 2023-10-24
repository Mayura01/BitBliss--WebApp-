const express = require("express");
const router = express.Router();
const { accounts, repository } = require("../database/database");

router.post("/getUsers", async (req, res) => {
    const { user } = req.body;

    try {
        const users = await accounts.find({ username: { $regex: user, $options: 'i' } });

        if (users.length > 0) {
            return res.status(200).json({ status: "success", relatedUsers: users });
        } else {
            return res.status(404).json({ status: "error", message: "No related users found" });
        }
    } catch (error) {
        console.error("Error finding related users", error);
        return res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
});


router.post("/getRepositories", async (req, res) => {
    const { topics } = req.body;

    try {
        // Assuming "topics" is a string or a comma-separated string, convert it to an array
        const topicsArray = Array.isArray(topics) ? topics : topics.split(',');

        const results = await repository.find({
            topics: { $in: topicsArray.map(topic => new RegExp(topic.trim(), 'i')) },
        }).populate('owner', 'username');



        if (results.length > 0) {
            return res.status(200).json({ status: "success", repositories: results });
        } else {
            return res.status(404).json({ status: "error", message: "No related repositories found" });
        }
    } catch (error) {
        console.error("Error finding related repositories", error);
        return res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
});




module.exports = router;
