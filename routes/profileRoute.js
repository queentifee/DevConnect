const express = require('express');
const { createOrUpdateProfile, getProfile, getAllProfiles,getPaginatedProfile, followProfile, unfollowProfile, getProfileByUserId} = require('../controllers/profileController');
const protect = require('../middleware/authMiddleware')
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: Profile Management
 */

/**
 * @swagger
 * /api/v1/profile:
 *   post:
 *     summary: Create or update user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bio:
 *                 type: string
 *               currentRole:
 *                 type: array
 *                 items:
 *                   type: string
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               projects:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Profile created or updated
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */

router.post('/', protect, createOrUpdateProfile);

/**
 * @swagger
 * /api/v1/profile:
 *   get:
 *     summary: Get current user's profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile fetched successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Profile not found
 */

router.get('/', protect,  getProfile);

/**
 * @swagger
 * /api/v1/profile/all-profiles:
 *   get:
 *     summary: Get all user profiles
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all profiles
 *       401:
 *         description: Unauthorized
 */

router.get('/all-profiles', protect, getAllProfiles);

/**
 * @swagger
 * /api/v1/profile/pagination:
 *   get:
 *     summary: Get paginated user profiles
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Paginated list of profiles
 *       401:
 *         description: Unauthorized
 */

router.get('/pagination', protect, getPaginatedProfile);

/**
 * @swagger
 * /api/v1/profile/{id}/follow:
 *   post:
 *     summary: Follow a user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to follow
 *     responses:
 *       200:
 *         description: Successfully followed the user
 *       400:
 *         description: Invalid ID
 *       401:
 *         description: Unauthorized
 */

router.post('/:id/follow', protect, followProfile);

/**
 * @swagger
 * /api/v1/profile/{id}/unfollow:
 *   post:
 *     summary: Unfollow a user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to unfollow
 *     responses:
 *       200:
 *         description: Successfully unfollowed the user
 *       400:
 *         description: Invalid ID
 *       401:
 *         description: Unauthorized
 */

router.post('/:id/unfollow', protect, unfollowProfile);

module.exports = router;