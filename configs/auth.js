module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            return res.status(401).json({ message: 'Unauthorized, please login first.' });
        }
    }
};
