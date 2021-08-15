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
        $level: u.level || null,
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
      mage    VARCHAR(3),
      mjob    VARCHAR(63),
      mhome   VARCHAR(127),
      fname   VARCHAR(9),
      fage    VARCHAR(3),
      fjob    VARCHAR(63),
      ftele   VARCHAR(29),
      fhome   VARCHAR(127)
  )`,
    function(err) {
      if (err) console.log(err.message)
    }
  )
  let stmt1 = sdb.prepare(
    'INSERT INTO details VALUES ($uid,$mage,$mjob,$mhome,$fname,$fage,$fjob,$ftele,$fhome)'
  )
  details.forEach(d => {
    stmt1.run(
      {
        $uid: d.uid,
        $mage: d.mother.age || null,
        $mjob: d.mother.job || null,
        $mhome: d.mother.home || null,
        $fname: d.father.name || null,
        $fage: d.father.age || null,
        $fjob: d.father.job || null,
        $ftele: d.father.tele || null,
        $fhome: d.father.home || null
      },
      err => {
        if (err) console.log(err.message)
      }
    )
  })
  stmt1.finalize()

  sdb.run(
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
  )`,
    function(err) {
      if (err) console.log(err.message)
    }
  )
  sdb.run('CREATE INDEX ruid ON reports (uid)', function(err) {
    if (err) console.log(err.message)
  })
  let stmt2 = sdb.prepare(
    'INSERT INTO reports VALUES ($id,$uid,$age,$weight,$signalW,$height,$signalH,$head,$signalC,$result,$time)'
  )
  details.forEach(d => {
    d.reports.forEach(r => {
      stmt2.run(
        {
          $id: r.id || null,
          $uid: d.uid || null,
          $age: r.age || null,
          $weight: r.weight || null,
          $signalW: r.signalW || null,
          $height: r.height || null,
          $signalH: r.signalH || null,
          $head: r.head || null,
          $signalC: r.signalC || null,
          $result: r.result || null,
          $time: r.time || null
        },
        err => {
          if (err) console.log(err.message)
        }
      )
    })
  })
  stmt2.finalize()
})

sdb.close()
console.log('>>> migrating database...')
