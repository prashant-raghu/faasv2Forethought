const sequelize = require('sequelize');
const bcrypt = require('bcrypt');

const Config = require('../../environments/index');
const Auth = require('../../services/auth.service');
const User = require('./user.model');
const uuid = require('uuid').v4;
const { countries } = require('countries-list');
const _ = require('lodash');
const editJsonFile = require("edit-json-file");
const file = editJsonFile(`${__dirname}/country.json`);

exports.register = (req, res) => {
    const _b = req.body;
    if (!_b.password) {
        res.status(400).send({ message: "Password cannot be null" });
    } else if (!_b.email) {
        res.status(400).send({ message: "email cannot be null" });
    } else {
        User.findOne({
            where: {
                email: _b.email
            },
            attributes: ['id']
        })
            .then(u => {
                if (u) {
                    res.status(400).send({
                        status: false,
                        message: "Email already registered"
                    });
                } else {
                    User.create({
                        email: _b.email,
                        password: bcrypt.hashSync(_b.password, 0),
                        userName: _b.userName,
                        firstName: _b.firstName,
                        lastName: _b.lastName,
                        mobileNumber: _b.mobileNumber
                    })
                        .then(data => {
                            const auth = Auth.encode(data.id);
                            if (!Config.autoVerifyEmail) Mailer(auth);
                            res.status(200).send({ status: true, message: "Registered Successfully" });
                            return null;
                        })
                        .catch(e => {
                            console.error(e);
                            res.status(400).send({ status: false, error: e });
                        });
                }
                return null;
            })
            .catch(e => {
                console.error(e);
                res.status(400).send({ status: false, error: e });
            });
    }
};


//User Login Controller function, to be invoked at api call
exports.login = (req, res) => {
    const _b = req.body;
    (async () => {
        if (!_b.email) {
            res.status(400).send({ message: "Email cannot be null" });
        } else if (!_b.password) {
            res.status(401).send({ message: "Password cannot be null" });
        } else {
            const user = await User.findOne({ where: { email: _b.email } });
            if (!user) {
                throw new Error('data not found');
            } else if (!user.emailVerified) {
                throw new Error('Email not Verified');
            } else if (!bcrypt.compareSync(_b.password, user.password)) {
                throw new Error('Wrong Password');
            } else {
                const updatedUser = await User.findOne({ where: { id: user.id } });
                const auth = Auth.encode(user.id);
                return { ...(updatedUser.dataValues), auth: auth };
            }
        }
    })()
        .then(data => {
            res.status(200).json({ status: true, ...data });
        })
        .catch(err => {
            console.error(err.stack);
            res.status(400).json({ status: false, message: err.message });
        });
};

exports.get = (req, res) => {
    const _b = req.body;

    const opts = { where: {}, attributes: { exclude: ['password'] } };
    if (+_b.offset) opts.offset = +_b.offset;
    if (+_b.limit) opts.limit = +_b.limit;
    if (typeof _b.keyword === 'string') opts.where.name = { [sequelize.Op.like]: `%${_b.keyword}%` };

    User.findAll(opts)
        .then(u => {
            if (!u) {
                res.status(400).json({
                    status: false,
                    message: 'user not found'
                });
            } else {
                res.status(200).json({
                    status: true,
                    data: u
                });
            }
        })
        .catch(err => {
            console.error(err);
            res.status(400).json({ status: false });
        });
};

exports.update = (req, res) => {
    const _b = req.body;
    User.update({
        userName: _b.userName,
        firstName: _b.firstName,
        lastName: _b.lastName,
        mobileNumber: _b.mobileNumber,
    }, {
        where: {
            id: req.user.id,
        }
    })
        .then(u => {
            res.status(200).json({ ...u.dataValues, status: true });
        })
        .catch(err => {
            console.error(err);
            res.status(400).json({ status: false });
        });
};
