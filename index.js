const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { swaggerUi, swaggerSpec }= require ('./utils/swagger.js')


dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

const routes = [
  { path: '/auth', file: './routes/authRoute' },
  { path: '/profile', file: './routes/profileRoute' },
  { path: '/users', file: './routes/userRoutes' },
  { path: '/logs', file: './routes/bugLog' },
  { path: '/post', file: './routes/postRoute' },
  { path: '/file', file: './routes/uploadRoute' },
  { path: '/ai', file: './routes/AiRoute.js' },

];

routes.forEach(route => {
  app.use (`/api/v1${route.path}`, require(route.file));
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));





const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`);
});
