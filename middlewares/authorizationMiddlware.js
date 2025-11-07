
 function authorize(roles = []) {
  if (typeof roles === "string") {
    roles = [roles];
  }

  return (req, res, next) => {
    console.log(req.auth)
    const userRole = req.auth?.role; 
  
    if (!userRole) {
      
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (roles.length && !roles.includes(userRole)) {
      return res.status(403).json({ message: "Forbidden: Access Denied" });
    }

    next();
  };
}
export default authorize