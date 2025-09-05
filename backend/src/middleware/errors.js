export function notFound(req, res, next) {
  res.status(404).json({ error: 'Not found' });
}

export function errorHandler(err, req, res, next) {
  console.error(err);
  
  if (err.name === 'MongoServerError' && err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({ 
      error: `Duplicate ${field} value. This ${field} already exists.` 
    });
  }
  
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Server error' });
}