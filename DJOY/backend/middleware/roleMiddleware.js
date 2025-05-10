export const isAdminOrCollaborator = (req, res, next) => {
    const role = req.user?.role;
    if (!role || (role !== "admin" && role !== "collaborator")) {
      return res.status(403).json({ message: "Access denied." });
    }
    req.userRole = role;
    next();
  };

  export const isAdmin = (req, res, next) => {
    const role = req.userRole || req.user?.role;
  
    if (role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }
  
    next();
  };