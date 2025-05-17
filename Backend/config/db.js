require('dotenv').config();

module.exports = {
  PRIMARY_DATABASE_URL: process.env.PRIMARY_DATABASE_URL,
  SECONDARY_DATABASE_URL: process.env.SECONDARY_DATABASE_URL,
  PRIMARY_HOST: process.env.PRIMARY_HOST,
  PRIMARY_USER: process.env.PRIMARY_USER,
  PRIMARY_PASSWORD: process.env.PRIMARY_PASSWORD,
  PRIMARY_DB: process.env.PRIMARY_DB,
  
  SECONDARY_HOST: process.env.SECONDARY_HOST,
  SECONDARY_USER: process.env.SECONDARY_USER,
  SECONDARY_PASSWORD: process.env.SECONDARY_PASSWORD,
  SECONDARY_DB: process.env.SECONDARY_DB,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  replication: {
    enabled: process.env.REPLICATION_ENABLED === 'true' || false
  }
};