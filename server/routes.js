'use strict';

var core       = require('./controllers'),
    middleware = require('./controllers/middleware'),
    users      = require('./controllers/users'),
    session    = require('./controllers/session');


module.exports = function(app) {  

  //User API
  app.param('username', users.loadByUsername);
  app.param('userId', users.loadByUserId);
  app.post('/api/users', users.create);
  app.put('/api/users/password', users.changePassword);
  app.get('/api/users/currentUser', users.currentUser);
  app.get('/api/users/id/:userId', users.show);
  app.get('/api/users/:username', users.show);

  //Session API
  app.post('/api/session', session.login);
  app.del('/api/session', session.logout);

  app.get('/api/*', function(req, res) {
    res.send(404);
  });
  
  app.get('/partials/*', core.partials);
  app.get('/*', middleware.setUserCookie, core.index); 
};