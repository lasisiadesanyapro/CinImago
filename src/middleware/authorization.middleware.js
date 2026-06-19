export const restrictTo = (...role) => {
  return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      return next(
        res.status(403).json({
          message: "You do not have permission to perform this action",
        }),
      );
    }

    next();
  };
};
