const sequelize = require("../../sequelize");
const axios = require("axios");
const Invoice = require("../../models/Invoice");

const API_KEY = process.env.PLISIO_API_KEY;
const API_URL = process.env.PLISIO_API_URL;

const OWN_API_URL = process.env.OWN_API_URL;

const instance = axios.create({
  baseURL: API_URL,
});

async function createInvoice(req, res) {
  const { priceAmount, orderDescription } = req.body;
  if (!priceAmount) {
    return res.status(400).json({ error: "The priceAmount is required" });
  }
  if (!orderDescription) {
    return res.status(400).json({ error: "The orderDescription is required" });
  }

  try {
    const result = await sequelize.transaction(async (t) => {
      const invoice = await Invoice.create({
        amount: priceAmount,
        link: "",
        userId: req.user.id,
      });

      try {
        const { data } = await instance.get("/invoices/new", {
          params: {
            currency: "USDT_BSC",
            order_name: "Account Activations Purchase",
            order_number: invoice.id,
            source_currency: "USD",
            source_amount: priceAmount,
            allowed_psys_cids:
              "LTC,DASH,TZEC,DOGE,BCH,XMR,BTT,USDT_TRX,TRX,BNB,BUSD,USDT_BSC,ETC",
            description: orderDescription,
            callback_url: `${OWN_API_URL}/invoices/update?json=true`,
            email: "email",
            api_key: API_KEY,
            expire_min: 15,
          },
        });

        const updatedInvoice = await invoice.update({
          link: data.data.invoice_url,
        });

        return { type: "success", data: updatedInvoice.toJSON() };
      } catch (error) {
        await invoice.destroy();
        return {
          type: "error",
          message: "The billing provider is currently unavailable",
          status: 405,
        };
      }
    });

    if (result.type === "error") {
      return res.status(result.status).json({ error: result.message });
    }

    return res.json(result.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "The database is currently unavailable." });
  }
}

module.exports = createInvoice;
