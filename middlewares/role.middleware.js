// middlewares/role.middleware.js
export const checkRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Akses ditolak. Peran tidak sesuai.' });
    }
    next();
  };
};
