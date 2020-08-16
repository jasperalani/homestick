const express = require('express');
const router = express.Router();
const _ = require('lodash');
const mysql = require('mysql');

const queryBuilder = require('@jasperalani/mysql-query-builder');

const connectionPool = mysql.createPool({
  host: "192.168.1.207",
  user: "root",
  password: "password",
  database: "homestick"
});

const Global = {
  title: 'Homestick',
  description: 'Paste and retrieve text',
}

/* Homepage / Create a new paste */
/** @function router.get */
router.get('/', function(req, res, next) {

  let error = '';

  /** @function _.isEmpty */
  if( ! _.isEmpty(req.query)) {
    if(req.query.error !== undefined){
      switch(req.query.error){
        case 'NoContent':
          error = 'You have to write something to save it';
      }
    }
  }

  const create = {
    title: Global.title,
    description: Global.description,
    error: error
  };

  res.render('create', create);
});

/** @function router.post */
router.post('/create', function(req, res, next) {
  const content = req.body;
  // content.text

  if(content.text.length === 0){
    res.redirect('/?error=NoContent');
    return
  }

  const identifier = generateIdentifier(6);

  const checkForUniqueIdentifierSQL = queryBuilder.select(
      'identifier',
      'content',
      "identifier = '" + identifier + "'"
  );

  connectionPool.getConnection((err, connection) => {

    connection.query(checkForUniqueIdentifierSQL, function (err, result, fields) {
      if (err) throw err;
      if(result.length > 0){
        // identifier has been used already
        // crash
        connection.release();
        process.exit();
      }
    });

    // create entry in database
    const createEntrySQL = queryBuilder.insert(
        ['identifier', 'text'],
        [identifier, content.text],
        'content'
    );

    connection.query(createEntrySQL, function (err, result, fields) {
      if (err) throw err;
      if(result.affectedRows === 1){
        // successful insert
      }
    });

    connection.release();

  });


  res.redirect('/' + identifier);
});

/* View entry */
/** @function router.post */
router.get(/([A-Za-z])\w+/, function(req, res, next) {

  const identifier = req.path.substr(1);

  const retrieveEntrySQL = queryBuilder.select(
      'text',
      'content',
      "identifier = '" + identifier + "'"
  );

  connectionPool.getConnection((err, connection) => {

    connection.query(retrieveEntrySQL, function (err, result, fields) {
      if (err) throw err;
      result = JSON.parse(JSON.stringify(result))

      if(result.length > 0){

        const text = result[0].text;

        const view = {
          title: Global.title,
          description: Global.description,
          content: text
        };

        res.render('view', view);
      }
    });

    connection.release();
  });

});

function generateIdentifier(length) {
  let result           = '';
  const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for ( let i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

module.exports = router;