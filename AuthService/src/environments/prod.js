module.exports = {
    server: {
        url: 'http://127.0.0.1:8001',
        // ip: '204.48.26.50',
        ip: '127.0.0.1',
        port: 8001,
    },
    auth: {
        jwtSecret: 'secret',
        passport: {
            google: {
                clientId: '420839143399-4jivvlnf4lv52i6o781b05e1v9jo9qfp.apps.googleusercontent.com',
                secret: 'KUYO-wv3-PbOJ-P5DrCWpTjG'
            }
        },
    },
    db: {
        HOST: "localhost",
        USER: "root",
        PASSWORD: "Admin@1234",
        DB: "faasv2_auth",
        dialect: "mysql",
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    },
    admin: {
        email: 'admin@admin.com',
        password: 'admin',
        userName: 'admin',
    },
    autoVerifyEmail: true,
    smtp: {
        sendgrid: {
            email: 'infonodedev1@gmail.com',
            user: 'apikey',
            pass: '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'
        }
    },
    passport: {
        apple: {
            clientID: "saa",
            teamID: "",
            callbackURL: "",
            keyID: "",
            privateKeyLocation: "",
            passReqToCallback: true
        },

        google: {
            clientId: "404532834190-mt1mvdjeme7psp0bkcddo1hl865m3vno.apps.googleusercontent.com",
            clientSecret: "oHLCfS7PsMe4OgrfbQIpkRwi",
            callbackURL: "http://localhost:3000/"
        },

        facebook: {
            clientID: "580206789299640",
            clientSecret: "c078c0d167f04da3fac1ec5cd5ade76b",
            callbackURL: "http://localhost:3000/",
        }

    }
};
