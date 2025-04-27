const functions = require('firebase-functions');
const axios = require('axios');

// --- Variables de configuración para WhatsApp ---
const TOKEN = functions.config().waba.token;
const PHONE_ID = functions.config().waba.phone_id;

// --- Función para enviar WhatsApp ---
exports.sendWhatsapp = functions.https.onRequest(async (req, res) => {
  const { to, folio, link } = req.body;
  try {
    await axios.post(`https://graph.facebook.com/v19.0/${PHONE_ID}/messages`, {
      messaging_product: 'whatsapp',
      to: `whatsapp:${to}`,
      type: 'template',
      template: {
        name: 'contrato_firmado',
        language: { code: 'es_MX' },
        components: [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: folio },
              { type: 'text', text: link }
            ]
          }
        ]
      }
    }, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    res.send('Mensaje enviado correctamente');
  } catch (error) {
    console.error('Error al enviar mensaje:', error.response ? error.response.data : error);
    res.status(500).send('Error al enviar mensaje');
  }
});

// --- Función de prueba Hello World (temporal) ---
exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("¡Hola, mundo desde Firebase Functions!");
});
