const ActivationPrice = require('../../models/ActivationPrice');

async function getAllActivationPrices(req, res) {
  try {
    const activationPrcies = await ActivationPrice.findAll();

    return res.json(activationPrcies.map((actPr) => actPr.toJSON()));
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'The database is currently unavailable.' });
  }
}

module.exports = getAllActivationPrices;
