var express = require('express');
var router = express.Router();
const client = require('../connections/pgClient');
const uuidv4 = require('uuid').v4;

/* GET users listing. */
router.get('/api/user/nodes', function(req, res, next) {
  const queryStr = `SELECT * FROM nodes;`;
  client.query(
      queryStr,
      (err, result) => {
          if (err) {
              console.error(err);
              return;
          }
          res.status(200).send(result.rows);
      }
  );
});
/* GET users listing. */
router.get('/api/user/nodes/:node_name', function(req, res, next) {
  const queryStr = `SELECT * FROM nodes WHERE node_name=$1;`;
  client.query(
      queryStr,
      [req.params.node_name],
      (err, result) => {
          if (err) {
              console.error(err);
              return;
          }
          res.status(200).send(result.rows);
      }
  );
});

router.post('/api/user/nodes', function(req, res, next) {
  const {ip, node_name} = req.body;
  const queryStr = `INSERT INTO nodes (node_id, ip, node_name) VALUES ($1, $2, $3);`;
  const id = uuidv4();
  client.query(
      queryStr,
      [id, ip, node_name],
      (err, result) => {
          if (err) {
              console.error(err);
              return;
          }
          res.status(200).send({node_id: id});
      }
  );
});

router.put('/api/user/nodes', function(req, res, next) {
  const {ip, node_name} = req.body;
  const queryStr = 'UPDATE nodes SET ip=$1 WHERE node_name=$2;';
  client.query(
      queryStr,
      [ip, node_name],
      (err, result) => {
          if (err) {
              console.error(err);
              return;
          }
          res.status(200).send("Updated");
      }
  );
});

router.delete('/api/user/nodes/:node_name', function(req, res, next) {
  const queryStr = 'DELETE FROM nodes WHERE node_name=$1;';
  client.query(
      queryStr,
      [req.params.node_name],
      (err, result) => {
          if (err) {
              console.error(err);
              return;
          }
          res.status(200).send("Deleted");
      }
  );
});

module.exports = router;
