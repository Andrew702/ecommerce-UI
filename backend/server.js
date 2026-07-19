require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Stripe = require('stripe');

const app = express();
app.use(cors());
app.use(express.json());


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.post('/create-checkout-session', async (req, res) => {

  const cart = req.body.cart || [];

  const line_items = cart.map(item => ({
      price_data: {
      currency: 'usd',
      product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
      },
      unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,
      success_url: 'http://localhost:4200/checkout/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:4200/cart',
  });

  res.json({ url: session.url });
});

// gemini chatbot
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.post('/api/chat', async (req, res) => {
  try {
    const { message, products } = req.body;

    const productsInfo = JSON.stringify(products, null, 2);
    
    const prompt = `You are a helpful product recommendation chatbot. You have these products:

    ${productsInfo}

    User: ${message}
    When recommending a product, ALWAYS include a link in this format:
    http://localhost:4200/main/shop/[PRODUCT_ID]
    Recommend a product if relevant. Keep response brief and natural.`;

    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + GEMINI_API_KEY,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    const data = await response.json();
    console.log('Gemini Response:', JSON.stringify(data, null, 2));
    const botReply = data.candidates[0].content.parts[0].text;

    res.json({ reply: botReply });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: 'Failed to get response' });
  }
});



app.listen(4242, () => {
  console.log('Backend running on http://localhost:4242');
  console.log("My key is:", process.env.STRIPE_SECRET_KEY ? "Found!" : "Missing!");
});