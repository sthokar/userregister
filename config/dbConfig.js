module.exports = process.env.DATABASE_URL || {
  host:     process.env.DB_HOST || 'localhost',
  port:     process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'user_auth_demo',
  /* user:     process.env.DB_USER, */
};
