const Invoice = require('../../models/Invoice');

async function getAllInvoices(req, res) {
  const userId = req.user.id;

  try {
    const invoices = await Invoice.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });

    return res.json(invoices.map((invoice) => invoice.toJSON()));
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'The database is currently unavailable.' });
  }
}

module.exports = getAllInvoices;
