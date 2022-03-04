PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "dob" datetime NOT NULL, "address" varchar NOT NULL, "description" varchar NOT NULL, "createdAt" datetime NOT NULL, "updatedAt" datetime NOT NULL);
INSERT INTO user VALUES(1,'User One','2007-12-03 10:15:30.000','123 State St.','This is my user','2022-03-04 21:16:50.682','2022-03-04 21:16:50.682');
INSERT INTO user VALUES(2,'User Two','2000-10-31 10:15:30.000','456 Elm St.','This is my second user','2022-03-04 21:25:06.462','2022-03-04 21:25:06.462');
DELETE FROM sqlite_sequence;
INSERT INTO sqlite_sequence VALUES('user',2);
COMMIT;
