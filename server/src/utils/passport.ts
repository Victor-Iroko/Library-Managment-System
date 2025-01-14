import passport from 'passport';
// const LocalStrategy = require('passport-local').Strategy
import {Strategy as LocalStrategy} from 'passport-local'
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import bcrypt from 'bcrypt';
import { userClient } from '../config/client';
import { jwtCookieExtractor, PayLoad } from './jwt';
import { getEnvVar } from './getEnv';





const local = new LocalStrategy(
    {
        usernameField: 'email', 
        passwordField: 'password',
        session: false
    },

    async (email, password, done) => {
            const user = await userClient.findUnique({
                where: {email: email}
            })
    
            if (!user) {
                return done(null, false, {message: "User is not registered"})
            }
    
            const isMatch = await bcrypt.compare(password, user.password);
    
            if (!isMatch) {
                return done(null, false, { message: 'Password is incorrect' });
            }
    
            return done(null, user); // Authentication successful
    }
)


const jwtBearer = new JwtStrategy(
    {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: getEnvVar('ACCESS_TOKEN') // since I'm meant to use it in a bearer token its access token
    },
    
    async (payload: PayLoad, done: any) => {
            const user = await userClient.findUnique({where: {id: payload.id}})
            if (!user) {
                return done(null, false, {message: "Bearer token is invalid"})
                }
            return done(null, user)
        } 
)

const jwtCookie = new JwtStrategy(
    {
        jwtFromRequest: jwtCookieExtractor,
        secretOrKey: getEnvVar('REFRESH_TOKEN') // since I'm meant to use it in a bearer token its access token
    },
    
    async (payload: PayLoad, done: any) => {
            const user = await userClient.findUnique({where: {id: payload.id}})
            if (!user) {
                return done(null, false, {message: "Refresh token is invalid"})
                }
            return done(null, user)
        } 
)

passport.use("local", local)
passport.use("jwt-bearer", jwtBearer)
passport.use("jwt-cookie", jwtCookie)

export default passport