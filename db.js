var promise = require('bluebird');

var pgp = require('pg-promise')({
  promiseLib: promise
});

var db = pgp({database:'restaurant'
  //
  });

db.query('SELECT * FROM restaurant')
  .then(function (results) {
    results.forEach(function (row) {
      console.log(row.id, row.name, row.distance, row.category);
    });
    db.one("SELECT * FROM restaurant WHERE restaurant.name = 'Villa Arcos'");
  })
  .then(function (row) {
    console.log(row)
  })
  .catch(function () {
    console.error(error);
  })
  .finally(function () {
    pgp.end();
  })
