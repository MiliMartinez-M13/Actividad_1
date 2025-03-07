const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');

app.use(express.static(path.join(__dirname, 'views/pages')));

// Set EJS as templating engine
app.set('view engine', 'ejs');


app.get('/', (req, res) => {

   
    res.render('pages/auth');
});


const server = app.listen(4000, function () {
    console.log('listening to port 4000')
});




var passport = require('passport');
var userProfile;
 
app.use(session({  // expressesion
  secret: 'eminem1542', // ¡CAMBIA ESTO! Debe ser una cadena aleatoria y segura
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } //  'secure: true' para HTTPS en producción
}));

app.use(passport.initialize()); // inicializa el servicio de login con google
app.use(passport.session());  // valida la sesion  y si fue creada con exito
 
app.get('/success', (req, res) => { //si la sesion fue creada con exito muestra succes
  res.render('pages/success', {user: userProfile});
});
app.get('/error', (req, res) => res.send("error logging in"));
 
passport.serializeUser(function(user, cb) {
  cb(null, user);
});
 
passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});


/*  Google AUTH  */
 
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = '625928363204-uohpsng29u47plvmskrtfuliie7g20jc.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "https://actividad-1-9jso.onrender.com" //"http://localhost:4000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      userProfile=profile;
      return done(null, userProfile);
  }
));
 
app.get('/auth/google',
  passport.authenticate('google', { scope : ['profile', 'email'] }));
 
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    // Successful authentication, redirect success.
    res.redirect('/success');
  });