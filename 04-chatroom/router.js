const passport = require('passport');
module.exports = (express) => {

    const router = express.Router();

    function isLoggedIn(req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        res.redirect('/auth/facebook');
    }

     // Secret Path to be protected
     router.get('/chatroom',  isLoggedIn, (req, res) => {
        res.sendFile(__dirname+ '/chatroom.html');
    });

    // The Authentication Route
    router.get('/auth/facebook', passport.authenticate('facebook',{ 
        scope: ['user_friends', 'manage_pages','email'] 
    }));

    // The Redirect URL route.
    router.get('/auth/facebook/callback', passport.authenticate('facebook',{ 
        failureRedirect:'/'
    }),(req,res)=>{
        //console.log(req.user);
        //console.log(req.cookies);
        //console.log(req.user.profile.name.givenName);
        //console.log("router"+req.session.id);
        //console.log(req.user);
        //console.log(req.user.profile._json.email);
        let name = req.user.profile.name.givenName;
        req.session.name = name;
        req.session.email = req.user.profile._json.email;
        //console.log(req.session.name);
        //res.cookie('name', name, { expires: new Date(Date.now() + 1000 * 60 * 60), httpOnly: true });
        res.redirect('/chatroom');
    });

    router.get('/error', (req, res) => {
        res.send('You are not logged in!');
    });

    router.get('/', (req, res) => {
        res.sendFile(__dirname + '/index.html');
    });

    // Logout url
    router.get('/logout',(req,res)=>{
        /*req.session.destroy((err)=>{
            if(err){}
            res.redirect("/")
        });*/
        req.logout();
        res.redirect("/")
    });
    return router;
}
