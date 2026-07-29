import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './modules/auth/auth.routes';
import solicitudesRoutes from './modules/solicitudes/solicitudes.routes';
import dashboardRoutes from './modules/dashboard/dashboard.routes';
import clientesRoutes from './modules/clientes/clientes.routes';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas de autenticación y solicitudes
app.use('/auth', authRoutes);
app.use('/solicitudes', solicitudesRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/clientes', clientesRoutes);
// Puerto del servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
