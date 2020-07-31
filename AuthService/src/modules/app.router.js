const express = require('express');
const router = express.Router();
const passport = require('passport');
const Controller = require('./app.controller');
router.use('/user', require('./user/user.router'));

/* GET home page. */
router.route('/').get(Controller.get);
module.exports = router;
