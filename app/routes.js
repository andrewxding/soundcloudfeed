var User       = require('./models/follow');
var Follow     = require('./models/user');
var mongoose = require('mongoose');
var followship = mongoose.connection.collection("Follow");
var collection = mongoose.connection.collection('users');

module.exports = function(app, passport, io) {
    console.log("EXPORTED")
    
    io.on('connection', function (socket) {
      socket.emit('news', { hello: 'world' });
      socket.on('my other event', function (data) {
        console.log(data);
      });
    });

// normal routes ===============================================================
    // app.get('/stream', isLoggedIn, function(req, res){
    //     console.log("hery")
    //     res.sendFile('/home/andrewxding/Documents/soundcloudfeed/public/views/activity.html');
    // });
    app.get("/loggedin", function(req, res) {
          res.json(req.isAuthenticated() ? req.user : '0');
    });
    app.get('/api/activity', isLoggedIn, function(req, res){/////change log in auth stuff alter

        followship.findOne({'username':req.user.local.username}, function(err, dbuser){
            if(err){
                console.log(err);
                res.status(500).send('Something broke!');
            }
            else{
                var songs = [];
                var count = 0;
                dbuser.following.forEach(function (followee){
                    
                    //console.log('looking', followee)
                    collection.findOne({'local.username': followee}, function(err, dbfollowee){
                        count++;
                        if(err){
                            console.log(err);
                            res.status(500).send('Something broke!');
                        }
                        else{
                            var entry = {};
                            entry['username'] = followee;
                            if (dbfollowee.lastsong){
                                var tmp = dbfollowee.lastsong.title.split(' by ');
                                entry['title']=tmp[0];
                                entry['artist']=tmp[1];
                                entry['date']=dbfollowee.lastsong.date;
                                console.log(dbfollowee);
                            }
                            songs.push(entry);
                            if(count == dbuser.following.length){
                                res.setHeader('statusCode', '200');
                                res.json(songs);
                            }

                        }
                    });
                });
            }
        });
    });
    app.get('/api/:user', isLoggedIn, function(req, res){
        followship.findOne({'username': req.params.user}, function(err, dbuser){
            if (err){
                res.setHeader('statusCode', '404');
                res.json('DB ERROR');
                console.log(err);
            }
            else{
                res.status(200).json(dbuser);
            }

        });
    });
    app.patch('/follow/:username', isLoggedIn, function(req, res){
        //user is in params as well as profile to follow
        followship.update(
            {'username': req.params.username},
            {$push:{'followers': req.user.local.username}}
        );

        followship.update(
            {'username': req.user.local.username},
            {$push:{'following': req.params.username}}
        );
        //#######TODO check for errors
        
    });
    app.patch('/unfollow/:username', isLoggedIn, function(req, res){
        //user is in params as well as profile to follow
        followship.update(
            {'username': req.params.username},
            {$pull:{'followers': req.user.local.username}}
        );

        followship.update(
            {'username': req.user.local.username},
            {$pull:{'following': req.params.username}}
        );
        //#######TODO check for errors
        
    });
    app.get('/*',function(req,res){
        //CHANGE LATER TO GET PATH
        res.sendFile('/home/andrewxding//Documents/soundcloudfeed/public/views/stream.html');//CONFIG THIS
    });
//     // LOGOUT ==============================
//     app.get('/logout', function(req, res) {
//         console.log('3');
//         req.logout();
//         res.redirect('/');
//     });


//     //change to patch later#################33
    app.patch('/api/patch', isLoggedIn, function(req,res){
        amqp.connect('amqp://localhost', function(err, conn) {
          conn.createChannel(function(err, ch) {
              var q = 'hello';
              var msg = req.body.newsong;
              ch.assertQueue(q, {durable: false});
              // Note: on Node 6 Buffer.from(msg) should be used
              ch.sendToQueue(q, new Buffer(msg));
                 console.log(" [x] Sent %s", msg);
           });
           setTimeout(function() { conn.close(); process.exit(0) }, 500);
        });


        console.log("patching", req.user.local.username);
        var query = {'local.username': req.user.local.username};
        console.log(req.body);

        var set = {  $set: {'lastsong.title': req.body.newsong, 'lastsong.date': "now"}};
        //console.log(moment.format());
        //var set = {  $set: {'lastsong': {'title': req.newsong, 'date':moment.format()}}};

        collection.updateOne(query, set);
        res.setHeader('stat', '200');
        res.json({data: "body"});
        //#######TODO check for errors
    });
//     // PROFILE SECTION =========================
//     app.get('/profile/:username', isLoggedIn, function(req, res) {
//         //console.log(req.params);
//         //console.log(req.user);//////////////////////////////////////
//         collection.findOne({ 'local.username' :  req.params.username }, function(err, dbuser) {
//                 // if there are any errors, return the error
//                 if (err)
//                     console.log(err);
//                 // if no user is found, return the message
//                 if (!dbuser)
//                     res.status(404)        // HTTP status 404: NotFound
//                         .send('Not found');
//                 else{
//                     res.render('profile.ejs', {
//                         user : dbuser,
//                         following: false
//                     });
                    
//                 }
//             });
//     });

//     app.post('/follow', isLoggedIn, function(req, res){
//         console.log(req.body);
//         console.log(req.user);//////////////////////////////////////
//         var user = JSON.parse(req.body.var);
//         //user is in params as well as profile to follow
//         followship.update(
//             {'username': user.local.username},
//             {$push:{'followers': req.user.local.username}}
//         );

//         followship.update(
//             {'username': req.user.local.username},
//             {$push:{'following': user.local.username}}
//         );

//         res.render('profile.ejs', {
//                         user : user,
//                         following : true
//                     });
        
//         //#######TODO check for errors
        
//     });

//     // LOGOUT ==============================
//     app.get('/logout', function(req, res) {
//         console.log('3');
//         req.logout();
//         res.redirect('/');
//     });


// // =============================================================================
// // AUTHENTICATE (FIRST LOGIN) ==================================================
// // =============================================================================

//     // locally --------------------------------
//         // LOGIN ===============================
//         // show the login form
//         app.get('/login', function(req, res) {
//             console.log('4');
//              if (req.isAuthenticated())
//                 res.redirect('/profile/'+req.user.local.username);
//             else
//                 res.render('login.ejs', { message: req.flash('loginMessage') });
//         });
// //---------------------------------------------
        app.post('/api/login',
          passport.authenticate('local-login', { failWithError: true }),
          function(req, res, next) {
            console.log('success1', req.user.local.username)
            // handle success
            if (req.xhr) { 
                console.log('success');
                return res.json({ user: req.user}); 
            }
            res.body = req.user;
            console.log("login : ", req.user)
            return res.json(req.user);
            //return res.redirect('/stream');
          },
          function(err, req, res, next) {
            // handle error
            console.log('fail1');
            if (req.xhr) { 
                console.log('fail');
                return res.json(err); 
            }

            return res.redirect('/login');
          }
        );

//         // process the login form
//         // app.post('/login', passport.authenticate('local-login', {
//         //     successRedirect : '/profile', // redirect to the secure profile section
//         //     failureRedirect : '/login', // redirect back to the signup page if there is an error
//         //     failureFlash : true // allow flash messages
//         // }));

//         // SIGNUP =================================
//         // show the signup form
//         app.get('/signup', function(req, res) {
//             console.log('5');
//             res.render('signup.ejs', { message: req.flash('signupMessage') });
//         });
        
        app.post('/api/signup',
          passport.authenticate('local-signup', { failWithError: true }),
          function(req, res, next) {
            console.log('success1', req.user.local.username)
            // handle success
            if (req.xhr) { 
                console.log('success');
                return res.json({ id: req.user._id }); 
            }
            
            return res.redirect('/profile');
          },
          function(err, req, res, next) {
            // handle error
            console.log('fail31');
            if (req.xhr) { 
                console.log('fai3l');
                return res.json(err); 
            }
            return res.redirect('/signup');
          }
        );

 
// // =============================================================================
// // AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// // =============================================================================

//     // locally --------------------------------
//         app.get('/connect/local', function(req, res) {
//             console.log('8');
//             res.render('connect-local.ejs', { message: req.flash('loginMessage') });
//         });
//         app.post('/connect/local', passport.authenticate('local-signup', {
//             successRedirect : '/profile', // redirect to the secure profile section
//             failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
//             failureFlash : true // allow flash messages
//         }));

  
// // =============================================================================
// // UNLINK ACCOUNTS =============================================================
// // =============================================================================
// // used to unlink accounts. for social accounts, just remove the token
// // for local account, remove email and password
// // user account will stay active in case they want to reconnect in the future

//     // local -----------------------------------
//     app.get('/unlink/local', isLoggedIn, function(req, res) {
//         var user            = req.user;
//         user.local.username    = undefined;
//         user.local.password = undefined;
//         user.save(function(err) {
//             res.redirect('/profile');
//         });
//     });

//         });
//     })


    app.use(handleError);
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    console.log('000');
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
var handleError = function(err,req,res,next){
    var output = {
        error: {
            name: err.name,
            message: err.message,
            text: err.toString()
        }
    };
    var statusCode = err.status || 500;
    res.status(statusCode).json(output);
}

