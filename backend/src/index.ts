import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './modules/auth/auth.routes';
import solicitudesRoutes from './modules/solicitudes/solicitudes.routes';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas de autenticación y solicitudes
app.use('/auth', authRoutes);
app.use('/solicitudes', solicitudesRoutes);
// Puerto del servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
