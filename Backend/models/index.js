const { Sequelize, DataTypes } = require('sequelize');
const dbConfig = require('../config/db.js');
const UserModel = require('./User.js');
const RoomModel = require('./Rooms.js');
const BuildingModel = require('./Buildings.js');
const BookingModel = require('./Bookings.js');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

// Database connection management
let sequelize;
let activeConnection = 'primary';
const db = {};

// Function to create a connection
const createConnection = async (connectionUrl, connectionName) => {
  try {
    const connection = new Sequelize(connectionUrl, {
      dialect: dbConfig.dialect,
      pool: dbConfig.pool,
      logging: false
    });
    await connection.authenticate();
    return connection;
  } catch (error) {
    return null;
  }
};

const initializeDatabase = async () => {
  sequelize = await createConnection(dbConfig.PRIMARY_DATABASE_URL, 'primary');
  if (!sequelize && dbConfig.replication.enabled) {
    sequelize = await createConnection(dbConfig.SECONDARY_DATABASE_URL, 'secondary');
    if (sequelize) {
      activeConnection = 'secondary';
    } else {
      console.error('All database connections failed. Application cannot start.');
      process.exit(1);
    }
  } else if (!sequelize) {
    console.error('Primary database connection failed and replication is not enabled. Application cannot start.');
    process.exit(1);
  }
  
  // Initialize models
  db.Sequelize = Sequelize;
  db.sequelize = sequelize;
  db.User = UserModel(sequelize, DataTypes);
  db.Room = RoomModel(sequelize, DataTypes);
  db.Building = BuildingModel(sequelize, DataTypes);
  db.Booking = BookingModel(sequelize, DataTypes);

  Object.values(db).forEach(model => {
    if (model.associate) {
      model.associate(db);
    }
  });
  if (dbConfig.replication.enabled) {
    setInterval(checkDatabaseHealth, 1000);
  }
  
  return db;
};

const checkDatabaseHealth = async () => {
  try {
    if (activeConnection === 'secondary') {
      const primaryConnection = await createConnection(dbConfig.PRIMARY_DATABASE_URL, 'primary');
  
      if (primaryConnection) {
        const exportPath = path.join(__dirname, '../../backup', `secondary_backup.sql`);
        if (!fs.existsSync(path.join(__dirname, '../../backup'))) {
          fs.mkdirSync(path.join(__dirname, '../../backup'), { recursive: true });
        }
        let exportCmd;
        if (dbConfig.dialect === 'mysql') {
          exportCmd = `mysqldump -h ${dbConfig.SECONDARY_HOST} -u ${dbConfig.SECONDARY_USER} -p${dbConfig.SECONDARY_PASSWORD} ${dbConfig.SECONDARY_DB} > ${exportPath}`;
        } else if (dbConfig.dialect === 'postgres') {
          exportCmd = `PGPASSWORD=${dbConfig.SECONDARY_PASSWORD} pg_dump -h ${dbConfig.SECONDARY_HOST} -U ${dbConfig.SECONDARY_USER} -d ${dbConfig.SECONDARY_DB} -f ${exportPath}`;
        }
        if (exportCmd) {
        await new Promise((resolve, reject) => {
          exec(exportCmd, (error, stdout, stderr) => {
            if (error) reject(error);
            else resolve();
          });
        });
        let importCmd;
        importCmd = `mysql -h ${dbConfig.PRIMARY_HOST} -u ${dbConfig.PRIMARY_USER} -p${dbConfig.PRIMARY_PASSWORD} ${dbConfig.PRIMARY_DB} < ${exportPath}`;
        if (importCmd) {
          await new Promise((resolve, reject) => {
            exec(importCmd, (error, stdout, stderr) => {
              if (error) reject(error);
              else resolve();
            });
          });
        }
        
        console.log('Data synchronization completed successfully');
      }

        await sequelize.close();
        sequelize = primaryConnection;
        db.sequelize = sequelize;
        activeConnection = 'primary';
        db.User = UserModel(sequelize, DataTypes);
        db.Room = RoomModel(sequelize, DataTypes);
        db.Building = BuildingModel(sequelize, DataTypes);
        db.Booking = BookingModel(sequelize, DataTypes);
        Object.values(db).forEach(model => {
          if (model.associate) {
            model.associate(db);
          }
        });
      }
    } 
    else {
      try {
        await sequelize.authenticate();
      } catch (error) {
        console.error('Primary database connection lost, attempting failover...');
        const secondaryConnection = await createConnection(dbConfig.SECONDARY_DATABASE_URL, 'secondary');
        if (secondaryConnection) {
          sequelize = secondaryConnection;
          db.sequelize = sequelize;
          activeConnection = 'secondary';
          db.User = UserModel(sequelize, DataTypes);
          db.Room = RoomModel(sequelize, DataTypes);
          db.Building = BuildingModel(sequelize, DataTypes);
          db.Booking = BookingModel(sequelize, DataTypes);
          Object.values(db).forEach(model => {
            if (model.associate) {
              model.associate(db);
            }
          });
          
          console.log('Failover to secondary database successful');
        } else {
          console.error('All database connections failed during health check');
        }
      }
    }
  } catch (error) {
    console.error('Error during database health check:', error);
  }
};

module.exports = initializeDatabase();