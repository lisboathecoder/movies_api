import express from 'express';
import 'dotenv/config';
import exemplosRoutes from './routes/moviesRoute.js';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('🎬 API funcionando');
});

// Rotas
app.use('/api', exemplosRoutes);

app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

app.listen(PORT, () => {
    console.log(`🎬 Sessão de cinema http://localhost:${PORT}`);
});