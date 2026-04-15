export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Prisma unique constraint violation
  if (err.code === 'P2002') {
    const field = err.meta.target[0];
    return res.status(409).json({ error: `${field} already exists` });
  }

  // Prisma record not found
  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Record not found' });
  }

  // Prisma foreign key constraint
  if (err.code === 'P2003') {
    return res.status(400).json({ error: 'Invalid reference to related record' });
  }

  // Default error
  const status = err.status || 500;
  const message = err.message || 'Internal server error';

  res.status(status).json({ error: message });
};
