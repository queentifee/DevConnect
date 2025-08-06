const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware"); 
const { createPost, getPostsByUserId, getPostById, updatePost, deletePost } = require('../controllers/postController');


/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Posts Management
 */
/**
 * @swagger
 * /api/v1/post:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user
 *               - content
 *             properties:
 *               user:
 *                 type: string
 *                 description: User ID
 *                 example: 665f81c56e9dbcb0e4c6d123
 *               content:
 *                 type: string
 *                 description: The post content
 *                 example: "I urgently need a frontend dev(React) for a project!"
 *               images:
 *                 type: string
 *                 description: Optional image URL
 *                 example: "[(image url extracted from cloudinary)]"
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

router.post("/add-post", authMiddleware, createPost);

/**
 * @swagger
 * /api/v1/post/all/{Id}:
 *   get:
 *     summary: Get all posts created by a specific user
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: Id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user whose posts you want to retrieve
 *     responses:
 *       200:
 *         description: Posts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 posts:
 *                   type: array
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No posts found
 *       500:
 *         description: Server error
 */

router.get("/all/:Id", authMiddleware, getPostsByUserId);

/**
 * @swagger
 * /api/v1/post/{id}:
 *   get:
 *     summary: Get a single post by its ID
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       404:
 *         description: Post not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

router.get("/:id", authMiddleware, getPostById);

/**
 * @swagger
 * /api/v1/post/{id}:
 *   put:
 *     summary: Update a post by ID
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Updated post content"
 *               image:
 *                 type: string
 *                 example: "https://cdn.devconnect.com/posts/updated-image.jpg"
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       400:
 *         description: Invalid request data
 *       404:
 *         description: Post not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

router.put("/:id", authMiddleware, updatePost);


/**
 * @swagger
 * /api/v1/post/{id}:
 *   delete:
 *     summary: Delete a post by its ID
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post to delete
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Post deleted
 *       404:
 *         description: Post not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

router.delete("/:id", authMiddleware, deletePost);




module.exports = router;
