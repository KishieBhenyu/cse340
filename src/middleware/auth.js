export const requireLogin = (req, res, next) => {
    if (!req.session.user) {
        req.flash('error', 'Please log in first');
        return res.redirect('/login');
    }
    next();
};

export const requireRole = (role) => {
    return (req, res, next) => {
        if (!req.session.user) {
            req.flash('error', 'Please log in first.');
            return res.redirect('/login');
        }

        if (req.session.user.role !== role) {
            req.flash('error', 'You do not have permission to access this page.');
            return res.redirect('/');
        }

        next();
    };
};