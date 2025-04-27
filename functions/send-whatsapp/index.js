const functions = require('firebase-functions/v2/https');
const axios = require('axios');

const TOKEN = functions.config().waba.token;
const PHONE_ID = functions.config().waba.phone_id;

exports.sendWhatsapp = functions.onRequest(async (req, res) => {
  const { to, folio, link } = req.body;
  try {
    await axios.post(
      `https://graph.facebook.com/v19.0/${PHONE_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to: `whatsapp:+${to}`,
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
      },
      {
        headers: { Authorization: `Bearer ${TOKEN}` }
      }
    );
    res.status(200).send('ok');
  } catch (e) {
    console.error(e.response?.data || e);
    res.status(500).send('error');
  }
});
