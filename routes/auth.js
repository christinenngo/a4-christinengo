var express = require( 'express' );
var passport = require('passport');
var GitHubStrategy = require('passport-github');

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: '/auth/github/callback'
},
    function(accessToken, refreshToken, profile, cb) {
        User.findOrCreate({ githubId: profile.id }, function(err, user) {
            return cb(err, user);
        });
    }
));

const router = express.Router();
router.get('/login', function(req, res, next) {
    res.render('login');
});

router.get('/auth/github',
    passport.authenticate('github'));

router.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    function(req, res) {
        res.render('/');
    });

router.post('/logout', function(req, res, next) {
    req.logout(function(err) {
        if(err) {
            return next(err);
        }
        res.redirect('/');
    });
});

module.exports = router;