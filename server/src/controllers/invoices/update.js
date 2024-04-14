const crypto = require('crypto');
const sequelize = require('../../sequelize');
const Invoice = require('../../models/Invoice');
const User = require('../../models/User');
const { getSocketByUserId } = require('../../wss');

const API_KEY = process.env.PLISIO_API_KEY;

function processStatus(status) {
  switch (status) {
    case 'new':
      return 'Created';
    case 'pending':
    case 'pending internal':
      return 'Pending';
    case 'expired':
    case 'cancelled':
      return 'Expired';
    case 'completed':
    case 'mismatch':
      return 'Completed';
    case 'error':
      return 'Error';
    default:
      return 'Unknown';
  }
}

function validateRequest(data) {
  if (typeof data === 'object' && data.verify_hash) {
    const ordered = { ...data };
    delete ordered.verify_hash;
    const string = JSON.stringify(ordered);
    const hmac = crypto.createHmac('sha1', API_KEY);
    hmac.update(string);
    const hash = hmac.digest('hex');
    return hash === data.verify_hash;
  }
  return false;
}

async function updateInvoice(req, res) {
  const { order_number: id, amount: received, currency, status } = req.body;

  if (!validateRequest(req.body)) {
    return res.sendStatus(401);
  }

  try {
    await sequelize.transaction(async () => {
      const invoice = await Invoice.findByPk(id);
      if (invoice) {
        const processedStatus = processStatus(status);

        if (processedStatus === 'Completed') {
          await User.increment('activationsLeft', {
            by: 1,
            where: { id: invoice.userId }
          });
        }

        await invoice.update({
          received: received || invoice.received,
          currency,
          status: processedStatus
        });

        await invoice.reload();

        const socket = getSocketByUserId(invoice.userId);

        if (socket) {
          socket.send(
            JSON.stringify({
              type: 'invoice_update',
              data: invoice.toJSON()
            })
          );
        }
      }
    });

    return res.sendStatus(200);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'The database is currently unavailable.' });
  }
}

module.exports = updateInvoice;
