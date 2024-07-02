exports.allowedTo = (...role) => {
    return (req, res, next) => {
        if (!role.includes(req.user.role)) {
            return next(new Error('You do not have permission to perform this action', { cause: 400 }));
        }
        next();
    };
};
