CREATE TABLE `buildings` (
  `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(255),
  `description` VARCHAR(255),
  `location` VARCHAR(255)
);

CREATE TABLE `rooms` (
  `room_id` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `room_number` INTEGER NOT NULL,
  `building_id` INTEGER NOT NULL,
  `available` TINYINT(1) NOT NULL DEFAULT 1,
  FOREIGN KEY (`building_id`) REFERENCES `buildings` (`id`)
);

CREATE TABLE `users` (
  `username` VARCHAR(50) PRIMARY KEY,
  `first_name` VARCHAR(255) NOT NULL,
  `last_name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `phone_num` VARCHAR(255) UNIQUE NOT NULL,
  `hashed_password` VARCHAR(255) NOT NULL,
  `role` ENUM('teacher', 'student', 'guest') NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT NOW(),
  `password_changed_at` DATETIME NOT NULL DEFAULT '2000-01-01 00:00:00'
);

CREATE TABLE `bookings` (
  `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `room_id` INTEGER NOT NULL,
  `user` VARCHAR(50) NOT NULL,
  `status` ENUM('cancelled', 'pending', 'confirmed') NOT NULL,
  `start_time` DATETIME NOT NULL,
  `end_time` DATETIME NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT NOW(),
  `updated_at` DATETIME NOT NULL DEFAULT NOW(),
  FOREIGN KEY (`room_id`) REFERENCES `rooms` (`room_id`),
  FOREIGN KEY (`user`) REFERENCES `users` (`username`)
);

CREATE INDEX idx_bookings_room_id ON bookings(room_id);
CREATE INDEX idx_bookings_user ON bookings(user);
CREATE INDEX idx_rooms_building_id ON rooms(building_id);

INSERT INTO buildings (name, description, location) VALUES ('A1', 'A1', 'Campus 1');
INSERT INTO buildings (name, description, location) VALUES ('A2', 'A2', 'Campus 1');
INSERT INTO buildings (name, description, location) VALUES ('A3', 'A3', 'Campus 1');
INSERT INTO buildings (name, description, location) VALUES ('A4', 'A4', 'Campus 1');
INSERT INTO buildings (name, description, location) VALUES ('B1', 'B1', 'Campus 1');
INSERT INTO buildings (name, description, location) VALUES ('B2', 'B2', 'Campus 1');
INSERT INTO buildings (name, description, location) VALUES ('B3', 'B3', 'Campus 1');
INSERT INTO buildings (name, description, location) VALUES ('B4', 'B4', 'Campus 1');
INSERT INTO buildings (name, description, location) VALUES ('C1', 'C1', 'Campus 1');
INSERT INTO buildings (name, description, location) VALUES ('C2', 'C2', 'Campus 1');
INSERT INTO buildings (name, description, location) VALUES ('C3', 'C3', 'Campus 1');
INSERT INTO buildings (name, description, location) VALUES ('C4', 'C4', 'Campus 1');
INSERT INTO buildings (name, description, location) VALUES ('H1', 'H1', 'Campus 2');
INSERT INTO buildings (name, description, location) VALUES ('H2', 'H2', 'Campus 2');
INSERT INTO buildings (name, description, location) VALUES ('H3', 'H3', 'Campus 2');
INSERT INTO buildings (name, description, location) VALUES ('H4', 'H4', 'Campus 2');
INSERT INTO buildings (name, description, location) VALUES ('H5', 'H5', 'Campus 2');

DELIMITER $$
CREATE PROCEDURE generate_rooms()
BEGIN
  DECLARE b_id INT;
  DECLARE floor INT;
  DECLARE room INT;

  DECLARE done INT DEFAULT 0;
  DECLARE cur CURSOR FOR SELECT id FROM buildings;
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

  OPEN cur;

  read_loop: LOOP
    FETCH cur INTO b_id;
    IF done THEN
      LEAVE read_loop;
    END IF;

    SET floor = 1;
    WHILE floor <= 5 DO
      SET room = 1;
      WHILE room <= 5 DO
        INSERT INTO rooms (room_number, building_id, available)
        VALUES (floor * 100 + room, b_id, 1);
        SET room = room + 1;
      END WHILE;
      SET floor = floor + 1;
    END WHILE;

  END LOOP;

  CLOSE cur;
END$$
DELIMITER ;

CALL generate_rooms();

