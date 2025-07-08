import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = 3000;

const OPENAI_API_KEY = 'API KEY'; // Reemplaza con tu clave de API

app.use(bodyParser.json());
app.use(cors());

app.post('/api/chat', async (req, res) => {
    const { history } = req.body; // Recibe el historial completo

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4", // Usa GPT-4 para respuestas contextuales
                messages: history, // Envía el historial completo
                max_tokens: 150,
                temperature: 0.7
            })
        });

        const data = await response.json();

        if (data.choices && data.choices.length > 0) {
            const botResponse = data.choices[0].message.content.trim();
            res.json({ response: botResponse }); // Devuelve la respuesta al frontend
        } else {
            console.error('Respuesta inesperada de OpenAI:', data);
            res.status(500).json({ error: 'Respuesta inesperada de OpenAI.' });
        }
    } catch (error) {
        console.error('Error al conectar con la API de OpenAI:', error);
        res.status(500).json({ error: 'Hubo un problema procesando tu solicitud.' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});