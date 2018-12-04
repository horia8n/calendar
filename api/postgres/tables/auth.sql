BEGIN TRANSACTION;
CREATE TABLE auth (
  token   VARCHAR(300) UNIQUE NOT NULL,
  id   VARCHAR(10),
  updated  TIMESTAMP  default current_timestamp
);
COMMIT;