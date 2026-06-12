import bcrypt from 'bcrypt';
import { createUser, authenticateUser, getAllUsers } from '../models/users.js';
import { getVolunteerProjects } from '../models/projects.js';

/* REGISTRATION*/
const showUserRegistrationForm = (req, res) => {
    res.render('register', { title: 'Register' });
};

const processUserRegistrationForm = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        await createUser(name, email, passwordHash);

        req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/login');
    } catch (error) {
        console.error('Error registering user:', error);
        req.flash('error', 'An error occurred during registration. Please try again.');
        res.redirect('/register');
    }
};

/* LOGIN*/
const showLoginForm = (req, res) => {
    res.render('login', { title: 'Login' });
};

const processLoginForm = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await authenticateUser(email, password);

        if (!user) {
            req.flash('error', 'Invalid email or password.');
            return res.redirect('/login');
        }

        req.session.user = user;
        req.flash('success', 'Login successful!');

        res.redirect('/dashboard');
    } catch (error) {
        console.error('Error during login:', error);
        req.flash('error', 'An error occurred during login.');
        res.redirect('/login');
    }
};

/* LOGOUT */
const processLogout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.redirect('/dashboard');
        }

        res.redirect('/login');
    });
};

/* DASHBOARD */
const showDashboard = async (req, res) => {
    const user = req.session.user;

    if (!user) {
        req.flash('error', 'Please log in.');
        return res.redirect('/login');
    }

    const volunteerProjects = await getVolunteerProjects(user.user_id);

    res.render("dashboard", {
        title: "Dashboard",
        user,
        volunteerProjects
    });
};


/* USERS PAGE (ADMIN ONLY) */
const showUsersPage = async (req, res) => {
    try {
        const users = await getAllUsers();

        res.render('users', {
            title: 'Users',
            users
        });
    } catch (error) {
        console.error(error);
        req.flash('error', 'Could not load users.');
        res.redirect('/dashboard');
    }
};

/* ROLE MIDDLEWARE */
const requireRole = (role) => {
    return (req, res, next) => {
        if (!req.session || !req.session.user) {
            req.flash('error', 'You must be logged in.');
            return res.redirect('/login');
        }

        if (req.session.user.role_name !== role) {
            req.flash('error', 'You do not have permission.');
            return res.redirect('/');
        }

        next();
    };
};

/*EXPORTS*/
export {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    showDashboard,
    showUsersPage,
    requireRole
};