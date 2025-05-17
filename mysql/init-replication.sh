#!/bin/bash

# Wait for MySQL services to be ready
echo "Waiting for MySQL services to be ready..."
sleep 30

# Set up replication user on primary
echo "Configuring replication user on primary..."
mysql -h mysql-primary -uroot -p${MYSQL_ROOT_PASSWORD} << EOF
DROP USER IF EXISTS 'replication_user'@'%';
CREATE USER 'replication_user'@'%' IDENTIFIED BY 'replication_password';
GRANT REPLICATION SLAVE ON *.* TO 'replication_user'@'%';
GRANT SELECT ON *.* TO 'replication_user'@'%';
FLUSH PRIVILEGES;
EOF

# Reset slave if it exists
echo "Resetting any existing replication configuration..."
mysql -h mysql-replica -uroot -p${MYSQL_ROOT_PASSWORD} << EOF
STOP SLAVE;
RESET SLAVE;
EOF

# Lock the primary database to prevent changes during data export
echo "Locking tables on primary for consistent backup..."
mysql -h mysql-primary -uroot -p${MYSQL_ROOT_PASSWORD} << EOF
FLUSH TABLES WITH READ LOCK;
SET GLOBAL read_only = ON;
EOF

# Get binary log position from primary while locked
echo "Getting binary log position from locked primary..."
MASTER_STATUS=$(mysql -h mysql-primary -uroot -p${MYSQL_ROOT_PASSWORD} -e "SHOW MASTER STATUS\G")
MASTER_LOG_FILE=$(echo "$MASTER_STATUS" | grep "File:" | awk '{print $2}')
MASTER_LOG_POS=$(echo "$MASTER_STATUS" | grep "Position:" | awk '{print $2}')

echo "Primary log file: $MASTER_LOG_FILE"
echo "Primary log position: $MASTER_LOG_POS"

# Dump database from primary
echo "Dumping data from primary database..."
mysqldump -h mysql-primary -uroot -p${MYSQL_ROOT_PASSWORD} --all-databases --master-data > /tmp/database_dump.sql

# Unlock primary database
echo "Unlocking primary database..."
mysql -h mysql-primary -uroot -p${MYSQL_ROOT_PASSWORD} << EOF
SET GLOBAL read_only = OFF;
UNLOCK TABLES;
EOF

# Import the dump to replica
echo "Importing data to replica database..."
mysql -h mysql-replica -uroot -p${MYSQL_ROOT_PASSWORD} < /tmp/database_dump.sql

# Configure replica to use primary
echo "Configuring replica to use primary..."
mysql -h mysql-replica -uroot -p${MYSQL_ROOT_PASSWORD} << EOF
CHANGE MASTER TO
  MASTER_HOST='mysql-primary',
  MASTER_USER='replication_user',
  MASTER_PASSWORD='replication_password',
  MASTER_LOG_FILE='$MASTER_LOG_FILE',
  MASTER_LOG_POS=$MASTER_LOG_POS;
START SLAVE;
EOF

# Verify replication is working
sleep 5
echo "Checking replication status..."
SLAVE_STATUS=$(mysql -h mysql-replica -uroot -p${MYSQL_ROOT_PASSWORD} -e "SHOW SLAVE STATUS\G")
IO_RUNNING=$(echo "$SLAVE_STATUS" | grep "Slave_IO_Running:" | awk '{print $2}')
SQL_RUNNING=$(echo "$SLAVE_STATUS" | grep "Slave_SQL_Running:" | awk '{print $2}')

if [ "$IO_RUNNING" = "Yes" ] && [ "$SQL_RUNNING" = "Yes" ]; then
  echo "Replication is running correctly!"
else
  echo "WARNING: Replication is not running correctly!"
  echo "Slave_IO_Running: $IO_RUNNING"
  echo "Slave_SQL_Running: $SQL_RUNNING"
  echo "Last Error:"
  echo "$SLAVE_STATUS" | grep "Last_Error"
  exit 1
fi

echo "Data synchronization and replication setup complete."