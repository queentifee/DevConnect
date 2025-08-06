const express = require ("express");
const protect = require ("../middleware/authMiddleware");
const router = express.Router();
const { CreateLog, getAllLogs, getByID, getUserLog, paginatedLogs, Update, Delete } = require ("../controllers/bugLog");


/**
 * @swagger
 * tags:
 *   name: Bug Logs
 *   description: Bug Log Management
 */
/**
 * @swagger
 * /api/v1/logs:
 *   post:
 *     summary: Create a new bug log
 *     tags: [Bug Logs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               cause:
 *                 type: string
 *               solution:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Bug log created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */

router.post ('/', protect, CreateLog);
/**
 * @swagger
 * /api/v1/logs/all:
 *   get:
 *     summary: Get all bug logs
 *     tags: [Bug Logs]
 *     responses:
 *       200:
 *         description: List of all bug logs
 *       500:
 *         description: Server error
 */

router.get ('/all', getAllLogs);


/**
 * @swagger
 * /api/v1/logs/pagination:
 *   get:
 *     summary: Get paginated bug logs with optional search and tag filters
 *     tags: [Bug Logs]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number (1-based)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of logs per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           default: ""
 *         description: Keyword to search in title, description, or tags (case-insensitive)
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *         description: Comma-separated list of tags to filter by
 *     responses:
 *       200:
 *         description: List of bug logs with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Bug Logs retrieved
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 *                 totalPages:
 *                   type: integer
 *                   example: 5
 *                 bugLogs:
 *                   type: array
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error
 *                 error:
 *                   type: string
 *                   example: Some internal error message
 */

router.get ('/paginated', paginatedLogs);


/**
 * @swagger
 * /api/v1/logs/{id}:
 *   get:
 *     summary: Get a bug log by ID
 *     tags: [Bug Logs]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Bug log ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bug log details
 *       404:
 *         description: Log not found
 */

router.get ('/:id', getByID);

/**
 * @swagger
 * /api/v1/logs/user/{userId}:
 *   get:
 *     summary: Get all bug logs for a specific user
 *     tags: [Bug Logs]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of bug logs for user
 *       404:
 *         description: No logs found for user
 */

router.get ('/user/:userId', getUserLog);


/**
 * @swagger
 * /api/v1/logs/{id}:
 *   put:
 *     summary: Update a bug log by ID
 *     tags: [Bug Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Bug log ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               severity:
 *                 type: string
 *                 enum: [low, medium, high]
 *     responses:
 *       200:
 *         description: Bug log updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Log not found
 */

router.put ('/:id', protect, Update);

/**
 * @swagger
 * /api/v1/logs/{id}:
 *   delete:
 *     summary: Delete a bug log by ID
 *     tags: [Bug Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Bug log ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bug log deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Log not found
 */

router.delete ('/:id', protect, Delete);

module.exports = router;

