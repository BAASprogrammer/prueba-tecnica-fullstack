import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import authRoutes from './modules/auth/auth.routes';
import solicitudesRoutes from './modules/solicitudes/solicitudes.routes';
import dashboardRoutes from './modules/dashboard/dashboard.routes';
import clientesRoutes from './modules/clientes/clientes.routes';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de Swagger
const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Gestión de Solicitudes',
      version: '1.0.0',
      description: 'API para administrar solicitudes de atención de clientes',
    },
    servers: [{ url: `http://localhost:${process.env.PORT || 4000}` }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
    },
  },
  apis: ['./src/modules/**/*.routes.ts'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas de autenticación y solicitudes
app.use('/auth', authRoutes);
app.use('/solicitudes', solicitudesRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/clientes', clientesRoutes);
// Puerto del servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
