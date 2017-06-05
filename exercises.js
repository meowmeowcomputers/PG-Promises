var promise = require('bluebird');

var pgp = require('pg-promise')({
  promiseLib: promise
});

var db = pgp({database:'music'
  //
  });
var co = require('co');

var prompt = require('prompt-promise');

function menu() {
  prompt("Add an album (1), artist (2), or track (3)?: ")
    .then(function(input) {
      try{
        if (input == '1') {
          addAlbum();
        }
        else if (input == '2') {
          addArtist();
        }
        else if (input =='3') {
          addTrack();
        }
        else{
          console.log('Invalid input!')
          menu();
        }
      }
      catch(error){
        console.error(error);
      }
      });
    }

function again(){

}
//Exercise 1, add album
function addAlbum() {
  var res = {};
  prompt('Name of album name you want to insert: ')
  .then(function albumname(val) {
    res.name=val;
    return prompt('Album year: ');
  })
  .then(function year(val) {
    res.year=val;
    return db.query('SELECT * FROM artist')
  })
  .then(function (results) {
    results.forEach(function (row) {
      console.log(row.id, row.name);
    })
    return prompt('Artist ID: ');
  })
  .then(function artistID(val) {
    res.artid=val;
    console.log(res);
  })
  .then(function insertion() {
    var statement = "INSERT INTO album (id, name, album_artist_id, year) \
    VALUES (default, ${name}, ${artid}, ${year})"
    db.result(statement, res);
    prompt.finish();
    pgp.end();
  })
  .catch(function rejected(err) {
    console.log('error:', err.stack);
    prompt.finish();
  });
}
//Exercise 2, Add artist
function addArtist() {
  var res = {};
  prompt('Name of the artist you would like to add: ')
  .then(function (val){
    res.name = val;
  })
  .then(function insertion() {
    var statement = "INSERT INTO artist (id, name) \
    VALUES (default, ${name})"
    db.result(statement, res);
    console.log(`Created album called ${res.name} with album ID `);
    prompt.finish();
    pgp.end();
  })
  .catch(function rejected(err) {
    console.log('error:', err.stack);
    prompt.finish();
  });
}
//Exercise 3, Add track
function addTrack(){
  var res = {};
  prompt('Name of the song you would like to add: ')
  .then(function (val){
    res.name=val;
    return prompt('Song duration: ');
  })
  .then(function (val){
    res.duration=parseInt(val);
    return db.query('SELECT id, name FROM album')
  })
  .then(function (results){
    results.forEach(function (row) {
      console.log(row.id, row.name);
    })
    return prompt('Enter album ID from one of the albums above: ');
  })
  .then(function (val){
    res.albumId = parseInt(val);
  })
  .then(function songInsertion() {
    var statement = "INSERT INTO song (id, name, duration) \
    VALUES (default, ${name}, ${duration})"
    db.result(statement, res);
    })
  .then(function trackInsertion(){
    return db.query("SELECT MAX(id) FROM song");
  })
  .then(function (songid){
    console.log(songid[0].max);
    var insert2 = {};
    insert2.id = parseInt(songid[0].max);
    insert2.albumId = parseInt(res.albumId);
    var statement = "INSERT INTO track (id, album_id, song_id) VALUES (default, ${albumId}, ${id})"
    return db.result(statement, insert2);
  })
  .then(function (){
    prompt.done()
    console.log('Done!');
  })
  .catch(function rejected(err) {
    console.log('error:', err.stack);
    prompt.finish();
  })
  .finally(function(){
    pgp.end();
  });
}

menu();
