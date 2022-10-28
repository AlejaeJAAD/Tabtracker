const path = require('path')

module.exports = {
  port: process.env.PORT || 3000,
  db: {
    database: process.env.DB_NAME || 'tabtracker',
    user: process.env.DB_USER || 'tabtracker',
    password: process.env.DB_PASS || 'tabtracker',
    options: {
      dialect: process.env.DIALECT || 'sqlite',
      host: process.env.HOST || 'localhost',
      storage: path.resolve(__dirname, '../../tabtracker.sqlite')
    }
  },
  YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY || 'AIzaSyDxgDt5XyVSTAwqZQYChOnHkNOebkPji3k',
  authentication: {
    jwtSecret: process.env.JWT_SECRET || 'secret',
    jwtSecretRefresh: process.env.JWT_SECRET_REFRESH || 'secret1908',
    jwtExpiration: 3600,
    jwtRefreshExpiration: 86400,
  }
}