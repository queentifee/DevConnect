const express = require ('express');
const router = express.Router();
const { askAI } = require ("../controllers/aiController");

/**
 * @swagger
 * tags:
 *   name: AI Assist
 *   description: AI Feature
 */

/**
 * @swagger
 * /api/v1/ai:
 *   post:
 *     summary: Ask the AI a question
 *     tags: [AI Assist]
 *     description: Sends a message to the AI and returns a response.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 example: "What is the capital of France?"
 *     responses:
 *       200:
 *         description: Successful response from AI
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 response:
 *                   type: string
 *                   example: "The capital of France is Paris."
 *       400:
 *         description: Bad request (e.g., missing message)
 *       500:
 *         description: Internal server error
 */

router.post("/", askAI);


module.exports = router;