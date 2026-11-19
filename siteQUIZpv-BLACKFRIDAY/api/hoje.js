// Número real de pessoas que acessaram o site hoje (quiz + entrada direta na página de vendas).
const { configured, pipeline, dayKey } = require('./_redis');

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (!configured()) return res.status(200).json({ n: 0 });
  try {
    const out = await pipeline([['HMGET', `q:${dayKey()}:all`, 'view', 'sales_direto']]);
    const v = (out && out[0] && out[0].result) || [];
    const n = (parseInt(v[0], 10) || 0) + (parseInt(v[1], 10) || 0);
    return res.status(200).json({ n });
  } catch (e) {
    return res.status(200).json({ n: 0 });
  }
};
