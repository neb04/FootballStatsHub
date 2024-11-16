CREATE TABLE TeamOwner (
ownerID INT PRIMARY KEY,
f_Name VARCHAR(50) NOT NULL,
l_Name VARCHAR(50) NOT NULL
);

CREATE TABLE Team (
    teamID INT PRIMARY KEY,
    team_Name VARCHAR(100) NOT NULL,
    coachID INT,
    division VARCHAR(50),
    standing VARCHAR(50),
    location VARCHAR(100),
    ownerID INT,
    general_manager VARCHAR(100),
    revenue INT,
    team_color VARCHAR(50),
    conference VARCHAR(50),
    record VARCHAR(20),
    FOREIGN KEY (ownerID) REFERENCES TeamOwner(ownerID)
);

CREATE TABLE Coach (
    coachID INT PRIMARY KEY,
    teamID INT NOT NULL,
    f_Name VARCHAR(50) NOT NULL,
    l_Name VARCHAR(50) NOT NULL,
    age INT,
    FOREIGN KEY (teamID) REFERENCES Team(teamID) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Player (
    playerID INT PRIMARY KEY,
    f_Name VARCHAR(50) NOT NULL,
    l_Name VARCHAR(50) NOT NULL,
    player_Number INT,
    team_ID INT,
    position VARCHAR(50),
    status VARCHAR(20),
    height_ft VARCHAR(50),
    height_in INT,
    weight INT,
    starting_Year INT,
    age INT,
    FOREIGN KEY (team_ID) REFERENCES Team(teamID) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Quarterback (
    playerID INT PRIMARY KEY,
    pass_yards INT,
    pass_att INT,
    pass_completions INT,
    touchdowns INT,
    interceptions INT,
    rushing_att INT,
    rushing_yards INT,
    fumbles INT,
    times_sacked INT,
    FOREIGN KEY (playerID) REFERENCES Player(playerID) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE RunningBack (
    playerID INT PRIMARY KEY,
    rush_att INT,
    rushing_yards INT,
    rush_touchdown INT,
    rec_target INT,
    rec_yards INT,
    rec_touchdowns INT,
    fumble INT,
    FOREIGN KEY (playerID) REFERENCES Player(playerID) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE WideReceiver (
    playerID INT PRIMARY KEY,
    target INT,
    receptions INT,
    yards INT,
    yards_per_recep FLOAT(15),
    touchdowns INT,
    fumble INT,
    kick_return INT,
    drops INT,
    FOREIGN KEY (playerID) REFERENCES Player(playerID) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Defense (
    teamID INT PRIMARY KEY,
    sacks INT,
    interceptions INT,
    touchdowns INT,
    tackles_for_loss INT,
    total_tackles INT,
    stuffs INT,
    FOREIGN KEY (teamID) REFERENCES Team(teamID) ON DELETE CASCADE ON UPDATE CASCADE
);

/* add this after insert

ALTER TABLE Team
ADD CONSTRAINT fk_team_coach
FOREIGN KEY(coachID) REFERENCES Coach(coachID);

*/