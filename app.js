const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const session = require('express-session');
const io = require('socket.io')(5000);

const users = {};

io.on('connection', socket => {
    socket.on('new-user', username => {
        users[socket.id] = username;
        socket.broadcast.emit('user-connected', username);
    });
    socket.on('send-chat-message', message => {
        socket.broadcast.emit('chat-message', {
            message: message,
            username: users[socket.id]
        });
    });
    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', users[socket.id]);
        delete users[socket.id];
    });
});
const app = express();



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const sessionLifetime = require('./config/keys').SESS_LIFETIME;
const sessionName = require('./config/keys').SESS_NAME;
const sessionSecret = require('./config/keys').SESS_SECRET;
app.use(session({
    name: sessionName,
    resave: false,
    saveUninitialized: false,
    secret: sessionSecret,
    cookie: {
        maxAge: sessionLifetime,
        sameSite: true,
        secure: false
    }
}));


module.exports = redirectLogin = (req, res, next) => {
    if (!req.session.userID) {
        res.redirect('/login');
    } else {
        next();
    }
};
// module.exports = redirectIndex = (req, res, next) => {
//     if(!req.session.userID) {
//         res.redirect('/index');
//     } else {
//         next();
//     }
// };

app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views/layouts/'
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

const db = require('./config/keys').mongoURI;
mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log('Mongo DB connected...');
}).catch((err => {
    console.log(err);
}));


// import routes
const index = require('./routes/index')
const api = require('./routes/api/api')

// set routes
app.use('/', index);
app.use('/api', api);

const server = app.listen(3000, () => {
    console.log('Server is running on port', server.address().port);
});