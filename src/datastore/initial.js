// initializing sql statement
module.exports = [
  `CREATE TABLE users(
    uid    INTEGER PRIMARY KEY,
    name   VARCHAR(63),
    baby   VARCHAR(63),
    male   VARCHAR(5),
    birth  VARCHAR(63),
    fixed  VARCHAR(63),
    tele   VARCHAR(63),
    note   TEXT,
    danger BOOLEAN,
    level  VARCHAR(1),
    weight VARCHAR(23),
    week   VARCHAR(23),
    G      VARCHAR(1),
    P      VARCHAR(1)
  )`,
  `CREATE TABLE basic(
      id       INTEGER PRIMARY KEY,
      pre      INTEGER,
      stored   VARCHAR(63),
      backup   VARCHAR(63),
      version  VARCHAR(9),
      increase INTEGER,
      search   VARCHAR(5)
  )`,
  `CREATE TABLE details(
      uid     INTEGER PRIMARY KEY,
      mage    VARCHAR(3),
      mjob    VARCHAR(63),
      mhome   VARCHAR(127),
      fname   VARCHAR(9),
      fage    VARCHAR(3),
      fjob    VARCHAR(63),
      ftele   VARCHAR(29),
      fhome   VARCHAR(127)
  )`,
  `CREATE TABLE reports(
      id      INTEGER PRIMARY KEY,
      uid     INTEGER,
      age     VARCHAR(9),
      weight  VARCHAR(6),
      signalW VARCHAR(1),
      height  VARCHAR(6),
      signalH VARCHAR(1),
      head    VARCHAR(6),
      signalC VARCHAR(1),
      result  TEXT,
      time    VARCHAR(9)
  )`
]
