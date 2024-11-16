ALTER TABLE Coach
DROP CONSTRAINT Coach_ibfk_1;
ALTER TABLE Coach
DROP COLUMN teamID;
ALTER TABLE Player
DROP COLUMN height_ft;
ALTER TABLE WideReceiver
DROP COLUMN yards_per_recep;

CREATE TABLE TeamRecord(
teamID int PRIMARY KEY,
standing varchar(3),
record varchar(5),
FOREIGN KEY(teamID) REFERENCES Team(teamID)
ON UPDATE CASCADE ON DELETE CASCADE
);


INSERT INTO TeamRecord VALUES (1, '1st', '4-2');
INSERT INTO TeamRecord VALUES (2, '1st', '4-2');
INSERT INTO TeamRecord VALUES (3, '3rd', '4-2');
INSERT INTO TeamRecord VALUES (4, '3rd', '2-4');
INSERT INTO TeamRecord VALUES (5, '4th', '1-5');
INSERT INTO TeamRecord VALUES (6, '3rd', '3-3');
INSERT INTO TeamRecord VALUES (7, '2nd', '4-3');
INSERT INTO TeamRecord VALUES (8, '2nd', '4-1');
INSERT INTO TeamRecord VALUES (9, '3rd', '4-2');
INSERT INTO TeamRecord VALUES (10, '3rd', '1-4');
INSERT INTO TeamRecord VALUES (11, '2nd', '3-3');
INSERT INTO TeamRecord VALUES (12, '1st', '5-0');
INSERT INTO TeamRecord VALUES (13,'4th', '2-4');
INSERT INTO TeamRecord VALUES (14,'4th', '1-4');
INSERT INTO TeamRecord VALUES (15,'2nd','2-3');
INSERT INTO TeamRecord VALUES (16,'1st','5-0');
INSERT INTO TeamRecord VALUES (17, '4th', '1-5');
INSERT INTO TeamRecord VALUES (18, '3rd', '2-5');
INSERT INTO TeamRecord VALUES (19, '4th', '2-4');
INSERT INTO TeamRecord VALUES (20, '3rd', '2-4');
INSERT INTO TeamRecord VALUES (21, '2nd','3-2');
INSERT INTO TeamRecord VALUES (22, '3rd','2-4');
INSERT INTO TeamRecord VALUES (23, '1st', '4-2');
INSERT INTO TeamRecord VALUES (24, '2nd', '3-2');
INSERT INTO TeamRecord VALUES (25, '1st', '3-3');
INSERT INTO TeamRecord VALUES (26, '1st', '3-3');
INSERT INTO TeamRecord VALUES (27, '1st', '4-2');
INSERT INTO TeamRecord VALUES (28, '1st', '4-2');
INSERT INTO TeamRecord VALUES (29, '4th', '1-5');
INSERT INTO TeamRecord VALUES (30, '4th', '1-5');
INSERT INTO TeamRecord VALUES (33, '1st', '4-2');
INSERT INTO TeamRecord VALUES (34, '1st','5-1');

ALTER TABLE Team
DROP COLUMN record;
ALTER TABLE Team
DROP COLUMN standing;

CREATE TABLE Conference(
conferenceID int PRIMARY KEY,
conference_Name char(3)
);

INSERT INTO Conference VALUES(1, 'AFC');
INSERT INTO Conference VALUES(2, 'NFC');

CREATE TABLE Division(
divisionID int PRIMARY KEY,
division_Name varchar(20),
conferenceID int,
FOREIGN KEY(conferenceID) REFERENCES Conference(conferenceID)
);

INSERT INTO Division VALUES(1, 'North', 1);
INSERT INTO Division VALUES(2, 'South', 1);
INSERT INTO Division VALUES(3, 'East', 1);
INSERT INTO Division VALUES(4, 'West', 1);
INSERT INTO Division VALUES(5, 'North', 2);
INSERT INTO Division VALUES(6, 'South', 2);
INSERT INTO Division VALUES(7, 'East', 2);
INSERT INTO Division VALUES(8, 'West', 2);

ALTER TABLE Team
DROP COLUMN conference;
ALTER TABLE Team
MODIFY division int;

UPDATE Team SET division=2 WHERE teamID=1;
UPDATE Team SET division=7 WHERE teamID=2;
UPDATE Team SET division=1 WHERE teamID=3;
UPDATE Team SET division=5 WHERE teamID=4;
UPDATE Team SET division=5 WHERE teamID=5;
UPDATE Team SET division=3 WHERE teamID=6;
UPDATE Team SET division=8 WHERE teamID=7;
UPDATE Team SET division=1 WHERE teamID=8;
UPDATE Team SET division=1 WHERE teamID=9;
UPDATE Team SET division=6 WHERE teamID=10;
UPDATE Team SET division=6 WHERE teamID=11;
UPDATE Team SET division=8 WHERE teamID=12;
UPDATE Team SET division=8 WHERE teamID=13;
UPDATE Team SET division=4 WHERE teamID=14;
UPDATE Team SET division=7 WHERE teamID=15;
UPDATE Team SET division=1 WHERE teamID=16;
UPDATE Team SET division=7 WHERE teamID=17;
UPDATE Team SET division=2 WHERE teamID=18;
UPDATE Team SET division=3 WHERE teamID=19;
UPDATE Team SET division=7 WHERE teamID=20;
UPDATE Team SET division=3 WHERE teamID=21;
UPDATE Team SET division=4 WHERE teamID=22;
UPDATE Team SET division=5 WHERE teamID=23;
UPDATE Team SET division=7 WHERE teamID=24;
UPDATE Team SET division=4 WHERE teamID=25;
UPDATE Team SET division=4 WHERE teamID=26;
UPDATE Team SET division=2 WHERE teamID=27;
UPDATE Team SET division=3 WHERE teamID=28;
UPDATE Team SET division=2 WHERE teamID=29;
UPDATE Team SET division=6 WHERE teamID=30;
UPDATE Team SET division=5 WHERE teamID=33;
UPDATE Team SET division=6 WHERE teamID=34;

ALTER TABLE Team
CHANGE COLUMN division divisionID int;
