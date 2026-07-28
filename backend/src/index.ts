import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { prisma } from './shared/prisma';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/solicitudes', async (req, res) => {
  try {
    const solicitudes = await prisma.solicitud.findMany({
      orderBy: { fecha: 'desc' }
    });
    res.json(solicitudes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener solicitudes' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
