const sequelize = require("../../sequelize");
const Invoice = require("../../models/Invoice");

async function fetchAllInvoices(req, res) {
  const userId = req.user.id;

  try {
    const result = await sequelize.transaction(async (t) => {
      const invoices = await Invoice.findAll({
        where: { userId },
        order: [["createdAt", "DESC"]],
      });
      return invoices.map((invoice) => invoice.toJSON());
    });
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "The database is currently unavailable." });
  }
}

module.exports = fetchAllInvoices;
