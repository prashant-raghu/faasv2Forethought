const
    passport = require('passport'),
    bcrypt = require('bcrypt'),
    JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt,
    AnonymousStrategy = require('passport-anonymous').Strategy,
    FacebookStrategy = require('passport-facebook-token'),
    AppleStrategy = require('passport-apple');


User = require('../modules/user/user.model.js')
Config = require('../environments/index');

const CustomGoogleStrategy = require('passport-custom').Strategy
const { OAuth2Client } = require('google-auth-library')

const ConfigPassport = Config.passport
const opts = {
    jwt: {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: Config.auth.jwtSecret,
        passReqToCallback: true
    },

    google: {
        clientID: ConfigPassport.google.clientId,
        clientSecret: ConfigPassport.google.clientSecret,
        callbackURL: ConfigPassport.google.callbackURL,
    },

    facebook: {
        clientID: ConfigPassport.facebook.clientID,
        clientSecret: ConfigPassport.facebook.clientSecret,
        callbackURL: ConfigPassport.facebook.callbackURL,
        fbGraphVersion: 'v7.0'
    },

    apple: {
        clientID: ConfigPassport.apple.clientID,
        teamID: ConfigPassport.apple.teamID,
        callbackURL: ConfigPassport.google.callbackURL,
        keyID: ConfigPassport.google.keyID,
        privateKeyLocation: ConfigPassport.google.privateKeyLocation,
        passReqToCallback: ConfigPassport.google.passReqToCallback,
    },
};

const client = new OAuth2Client(ConfigPassport.google.clientId)

module.exports = () => {

    passport.use('anonymous', new AnonymousStrategy);

    passport.use('user', new JwtStrategy(opts.jwt, function (req, jwt_payload, done) {
        User.findOne({
            where: {
                id: jwt_payload
            }
        })
            .then(u => {
                if (u) {
                    req.isUser = true;
                    done(null, u);
                } else done(null, false);
                return null;
            })
            .catch(e => done(e, false));
    }));

    passport.use(new AppleStrategy(opts.apple, (req, accessToken, refreshToken, decodedIdToken, profile, cb) => {
        cb(null, decodedIdToken);
    }))

    passport.use(new FacebookStrategy(opts.facebook, (accessToken, refreshToken, profile, cb) => {
        console.log(profile)
        return cb(null, profile);

    }))

    passport.use('custom-google', new CustomGoogleStrategy(
        async (req, done) => {
            const token = req.body.token
            const password = Date.now().toString()
            try {
                const ticket = await client.verifyIdToken({
                    idToken: token,
                    audience: ConfigPassport.google.clientId
                })
                const payload = ticket.getPayload()
                // console.log(payload)
                const emailId = payload.email

                User.findOrCreate({
                    where: {
                        email: emailId
                    },
                    defaults: {
                        userName: payload.given_name,
                        firstName: payload.given_name,
                        lastName: payload.family_name,
                        password: bcrypt.hashSync(password, 0)
                        //password can't be null
                    }
                })
                    .then(u => {
                        if (u) {
                            req.isUser = true;
                            done(null, u);
                        } else done(null, false);
                        return null;
                    })
                    .catch(e => done(e, false));


            } catch (error) {
                console.log(error)
                done(error, false)
            }
        }
    ))

}
