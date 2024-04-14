const axios = require('axios');
const sequelize = require('../../sequelize');
const Invoice = require('../../models/Invoice');
const ActivationPrice = require('../../models/ActivationPrice');
const { validateProps } = require('./utils');

const { PLISIO_API_KEY, PLISIO_API_URL, OWN_API_URL } = process.env;

const instance = axios.create({
  baseURL: PLISIO_API_URL
});

async function validatePrice(priceAmount, actQty) {
  const actPrices = await ActivationPrice.findAll();

  if (!actPrices.length) {
    return {
      type: 'error',
      message: 'No activation prices found',
      status: 404
    };
  }

  let truePriceAmount = 0;

  for (let i = 0; i < actPrices.length - 1; i += 1) {
    if (actQty < actPrices[i + 1].quantity) {
      truePriceAmount = actQty * actPrices[i].price;
      break;
    }
  }

  if (!truePriceAmount) {
    truePriceAmount = actQty * actPrices[actPrices.length - 1].price;
  }

  if (truePriceAmount !== priceAmount) {
    return { type: 'error', message: 'Invalid price amount', status: 400 };
  }

  return { type: 'success' };
}

async function createInvoice(req, res) {
  const userId = req.user.id;
  const reqBody = req.body;

  const validationError = validateProps(reqBody, [
    'priceAmount',
    'actQty',
    'orderDesc'
  ]);

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const { priceAmount, actQty, orderDesc } = reqBody;

  try {
    const result = await sequelize.transaction(async () => {
      const priceValidRes = await validatePrice(priceAmount, actQty);

      if (priceValidRes.type === 'error') {
        return res
          .status(priceValidRes.status)
          .json({ error: priceValidRes.message });
      }

      const invoice = await Invoice.create({
        amount: priceAmount,
        actQty,
        userId
      });

      try {
        const { data } = await instance.get('/invoices/new', {
          params: {
            currency: 'USDT_BSC',
            order_name: 'Account Activations Purchase',
            order_number: invoice.id,
            source_currency: 'USD',
            source_amount: priceAmount,
            allowed_psys_cids:
              'LTC,DASH,TZEC,DOGE,BCH,XMR,BTT,USDT_TRX,TRX,BNB,BUSD,USDT_BSC,ETC',
            description: orderDesc,
            callback_url: `${OWN_API_URL}/invoices/update?json=true`,
            email: 'email',
            api_key: PLISIO_API_KEY,
            expire_min: 15
          }
        });

        const updatedInvoice = await invoice.update({
          link: data.data.invoice_url
        });

        return { type: 'success', data: updatedInvoice.toJSON() };
      } catch (error) {
        await invoice.destroy();
        return {
          type: 'error',
          message: 'The billing provider is currently unavailable',
          status: 405
        };
      }
    });

    if (result.type === 'error') {
      return res.status(result.status).json({ error: result.message });
    }

    return res.json(result.data);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'The database is currently unavailable.' });
  }
}

module.exports = createInvoice;
