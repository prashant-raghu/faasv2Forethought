const jwt = require('jsonwebtoken');
const config = require('../environments/index');
const User = require('../modules/user/user.model');

exports.encode = (userId) => {
    const auth = `bearer ${jwt.sign(userId, config.auth.jwtSecret)}`;
    return auth;
};

exports.decode = (token) => {
    return decoded = jwt.verify(token.split(' ')[1], config.auth.jwtSecret);
};

exports.socketAuth = (io) => {
    io.use((socket, next) => {
        try {
            const token = socket.handshake.query.token.split(' ')[1];
            const decoded = jwt.verify(token, config.auth.jwtSecret);
            User.findOne({
                where: {id: decoded},
                attributes: ['id', 'userName', 'image'],
                include: {
                    model: Group
                }
            })
                .then(user => {
                    if (user) {
                        //user found
                        socket.user = user.dataValues;
                        next();
                    } else {
                        //user not found
                        console.log('user not found');
                        socket.disconnect();
                    }
                })
                .catch((err) => {
                    // error occured
                    console.log('bad token, error: ', err);
                    socket.disconnect();
                });
        } catch (err) {
            console.log('invalid token', err);
            socket.disconnect();
        }
    });
};
