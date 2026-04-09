import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HealthyTrack API',
      version: '1.0.0',
      description: 'API documentation for HealthyTrack app',
    },
    servers: [
      { url: 'http://localhost:5000/api', description: 'Development server' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id:       { type: 'string', example: '507f1f77bcf86cd799439011' },
            firstName: { type: 'string', example: 'Văn A' },
            lastName:  { type: 'string', example: 'Nguyễn' },
            username:  { type: 'string', example: 'nguyenvana' },
            email:     { type: 'string', example: 'test@email.com' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Profile: {
          type: 'object',
          properties: {
            gender:         { type: 'string', enum: ['male', 'female'] },
            age:            { type: 'number', example: 25 },
            height:         { type: 'number', example: 170 },
            weight:         { type: 'number', example: 65 },
            goal:           { type: 'string', enum: ['lose', 'maintain', 'gain'] },
            activityLevel:  { type: 'number', example: 1.375 },
            targetCalories: { type: 'number', example: 1600 },
            bmr:            { type: 'number', example: 1650 },
            tdee:           { type: 'number', example: 2200 },
          },
        },
        FoodEntry: {
          type: 'object',
          properties: {
            _id:      { type: 'string' },
            name:     { type: 'string', example: 'Phở bò' },
            amount:   { type: 'string', example: '1 tô' },
            calories: { type: 'number', example: 450 },
            mealType: { type: 'string', enum: ['breakfast', 'lunch', 'dinner', 'snack'] },
            date:     { type: 'string', example: '2026-03-31' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            user:  { $ref: '#/components/schemas/User' },
            token: { type: 'string', example: 'eyJhbGci...' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Lỗi xảy ra.' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);