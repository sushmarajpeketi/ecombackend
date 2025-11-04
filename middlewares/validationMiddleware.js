const validate = (schema) => (req, res, next) => {
  console.log("-------------------",req.body)
  const result = schema.safeParse(req.body);

  if (!result.success) {
    
    let error=""
    result.error.issues.forEach(element => {
      error+=`${element.path[0]}:${element.message} , `
    });
    return res.status(400).json({
      success: false,
      error,
    });
  }

  req.validatedData = result.data;
  next();
};
export default validate;
