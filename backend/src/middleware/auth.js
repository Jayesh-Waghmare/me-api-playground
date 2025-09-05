import 'dotenv/config';

export function authWrite(req, res, next) {
  const enabled = (process.env.WRITE_AUTH_ENABLED || 'false').toLowerCase() === 'true';
  if (!enabled) return next();

  const header = req.headers['authorization'] || '';
  const [type, token] = header.split(' ');
  if (type !== 'Basic' || !token) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Me-API"');
    return res.status(401).json({ error: 'Authentication required' });
  }
  const [user, pass] = Buffer.from(token, 'base64').toString('utf8').split(':');
  if (user === process.env.BASIC_AUTH_USER && pass === process.env.BASIC_AUTH_PASS) {
    return next();
  }
  return res.status(403).json({ error: 'Invalid credentials' });
}