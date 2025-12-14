// Middleware para validar roles
module.exports = function(rolRequerido) {
  return function(req, res, next) {
    if (req.user.rol !== rolRequerido) {
      return res.status(403).json({ msg: 'Acceso denegado - Rol insuficiente' });
    }
    next();
  };
};