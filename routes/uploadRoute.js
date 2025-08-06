const express = require("express");
const { uploadFile } = require("../controllers/uploadController");
const router = express.Router();
const multer = require ('multer');
const protect = require('../middleware/authMiddleware')


const upload = multer({ dest: 'uploads/' });

/**
 * @swagger
 * tags:
 *   name: File Management
 *   description: Endpoints for file management
 */

/**
 * @swagger
 * /api/v1/file:
 *   post:
 *     summary: Upload a file
 *     tags: [File Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - email
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File to be uploaded
 *               email:
 *                 type: string
 *                 description: User email.
 *                 example: "janedoe@gmail.com"
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *       400:
 *         description: Bad request - No file uploaded or phone number missing
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */


router.post('/', protect, upload.single('file'), uploadFile);

module.exports = router;
