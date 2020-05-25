CREATE SCHEMA `users` ;
USE users;

CREATE TABLE `user` (
  `username` varchar(32) NOT NULL,
  `password` varchar(128) DEFAULT NULL,
  `first_name` varchar(45) DEFAULT NULL,
  `last_name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `key_store` (
    `key_id` INT NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(45) DEFAULT NULL,
    `password` VARCHAR(100) DEFAULT NULL,
    `sitename` VARCHAR(100) DEFAULT NULL,
    `owner` VARCHAR(45) DEFAULT NULL,
    `if_private` TINYINT DEFAULT NULL,
    `last_modified_time` VARCHAR(45) DEFAULT NULL,
    PRIMARY KEY (`key_id`)
)  ENGINE=INNODB AUTO_INCREMENT=228 DEFAULT CHARSET=UTF8MB4 COLLATE = UTF8MB4_0900_AI_CI;

SET @@session.block_encryption_mode="aes-128-cbc";
SET @init_vector= RANDOM_BYTES(16);
