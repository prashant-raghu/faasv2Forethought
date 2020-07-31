const router = require('express').Router();
const passport = require('passport');

const Controller = require('./user.controller');
const UserGuard = passport.authenticate('user', {session: false});

router.post('/login', Controller.login);
router.post('/forgotPassword', Controller.forgotPassword);
router.post('/changePassword', UserGuard, Controller.changePassword);
// router.post('/verifyEmail', UserGuard, Controller.verifyEmail);
router.post('/register', Controller.register);
// router.post('/loginGuest', Controller.loginGuest);
router.post('/update',UserGuard, Controller.update);
router.post('/get', Controller.get);
router.get('/resetPassword/:token', Controller.resetPasswordT)
router.post('/resetPassword', Controller.resetPassword)

router.route('/')
    .get(UserGuard, Controller.get)
    .post(Controller.register)
    .put(UserGuard, Controller.update)
    .delete(UserGuard, Controller.delete);

module.exports = router;
