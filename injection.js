var promise = require('bluebird');

var pgp = require('pg-promise')({
  promiseLib: promise
});

var db = pgp({database:'restaurant'
  //
  });

var biz = {
  name: "Meow Meow Cafe 2"
}

var query = "INSERT INTO restaurant \
  VALUES (nextval('restaurant_id_seq'), ${name})";

console.log(query);
db.result(query, biz)
  .then(function (result) {
    console.log(result);
  pgp.end();
  });
