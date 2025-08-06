const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "DevConnect Backend API",
            description: "API documentation for DevConnect",
            version: "1.0"
        },
        servers: [
            {
                url: "http://localhost:5000/",
                description: 'Production server',
            },
            // {
            //     url: "https://joe-backend-6682.onrender.com", 
            //     description: "Live server",
            // },
            
        ],
        components: {
            securitySchemes: {
              bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
              },
            },
          },
          security: [
            {
              bearerAuth: [],
            },
          ],
    },
    apis: ["./routes/*.js"]
};




const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };