import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import session from 'express-session';
import flash from 'express-flash';

import { testConnection } from './src/models/db.js';
import router from './src/routes.js';

const SESSION_SECRET = process.env.SESSION_SECRET;

// Environment
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';

// Port
const PORT = process.env.PORT || 3000;

// Paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/* ========================
   BODY PARSING MIDDLEWARE
======================== */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* ========================
   SESSION MIDDLEWARE
======================== */
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 60 * 1000 // 1 hour
    }
}));

/* ========================
   FLASH MIDDLEWARE
======================== */
app.use(flash());

/* ========================
   STATIC FILES
======================== */
app.use(express.static(path.join(__dirname, 'public')));

/* ========================
   VIEW ENGINE
======================== */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

/* ========================
   LOGGING MIDDLEWARE
======================== */
app.use((req, res, next) => {
    if (NODE_ENV === 'development') {
        console.log(`${req.method} ${req.url}`);
    }
    next();
});

/* ========================
   GLOBAL TEMPLATE VARIABLES
======================== */
app.use((req, res, next) => {
    res.locals.NODE_ENV = NODE_ENV;
    res.locals.messages = req.flash();
    next();
});

/* ========================
   ROUTES
======================== */
app.use(router);

/* ========================
   404 HANDLER
======================== */
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

/* ========================
   ERROR HANDLER
======================== */
app.use((err, req, res, next) => {
    console.error('Error occurred:', err.message);
    console.error(err.stack);

    const status = err.status || 500;
    const template = status === 404 ? '404' : '500';

    res.status(status).render(`errors/${template}`, {
        title: status === 404 ? 'Page Not Found' : 'Server Error',
        error: err.message,
        stack: err.stack
    });
});

/* ========================
   START SERVER
======================== */
app.listen(PORT, async () => {
    try {
        await testConnection();
        console.log(`Server running at http://127.0.0.1:${PORT}`);
        console.log(`Environment: ${NODE_ENV}`);
    } catch (error) {
        console.error('DB connection error:', error);
    }
});