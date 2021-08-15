// only for migrating data.json to sqlite data.db
const Datastore = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('data.json')
const ldb = Datastore(adapter)

const sqlite3 = require('sqlite3').verbose()
const sdb = new sqlite3.Database('data.db')

const users = ldb.get('users').value()
const details = ldb.get('details').value()

// migrate users data
sdb.serialize(() => {
  sdb.run(
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
    function(err) {
      if (err) console.log(err.message)
    }
  )
  let stmt = sdb.prepare(
    'INSERT INTO users VALUES ($uid,$name,$baby,$male,$birth,$fixed,$tele,$note,$danger,$level,$weight,$week,$G,$P)'
  )
  users.forEach(u => {
    stmt.run(
      {
        $uid: u.uid,
        $name: u.name || null,
        $baby: u.baby || null,
        $male: u.male || null,
        $birth: u.birth || null,
        $fixed: u.fixed || null,
        $tele: u.tele || null,
        $note: u.note || null,
        $danger: u.danger || false,
        $weight: u.weight || null,
        $week: u.week || null,
        $G: u.G || null,
        $P: u.P || null
      },
      err => {
        if (err) console.log(err.message)
      }
    )
  })
  stmt.finalize()

  // sdb.all('SELECT * FROM users LIMIT 10', function(_err, rows) {
  //   console.log(rows)
  // })
})

// migrate basic data
sdb.serialize(() => {
  sdb.run(
    `CREATE TABLE basic(
      id       INTEGER PRIMARY KEY,
      pre      INTEGER,
      stored   VARCHAR(63),
      backup   VARCHAR(63),
      version  VARCHAR(9),
      increase INTEGER,
      search   VARCHAR(5)
  )`,
    function(err) {
      if (err) console.log(err.message)
    }
  )
  let tmp = {
    $pre: ldb.get('pre').value(),
    $stored: ldb.get('stored').value(),
    $backup: ldb.get('backup').value(),
    $version: ldb.get('version').value(),
    $increase: ldb.get('increase').value(),
    $search: ldb.get('search').value()
  }
  sdb.run(
    'INSERT INTO basic VALUES (1,$pre,$stored,$backup,$version,$increase,$search)',
    tmp,
    err => {
      if (err) console.log(err.message)
    }
  )
})

// migrate details data
sdb.serialize(() => {
  sdb.run(
    `CREATE TABLE details(
      uid     INTEGER PRIMARY KEY,
      mother  TEXT,
      father  TEXT,
      reports TEXT
  )`,
    function(err) {
      if (err) console.log(err.message)
    }
  )
  let stmt = sdb.prepare(
    'INSERT INTO details VALUES ($uid,$mother,$father,$reports)'
  )
  details.forEach(d => {
    stmt.run(
      {
        $uid: d.uid,
        $mother: JSON.stringify(d.mother) || null,
        $father: JSON.stringify(d.father) || null,
        $reports: JSON.stringify(d.$reports) || null
      },
      err => {
        if (err) console.log(err.message)
      }
    )
  })
  stmt.finalize()
})

sdb.close()
console.log('>>> migration complete.')
