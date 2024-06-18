import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {

    // token will be in the cookies if the user has logged in recently
    const token = req.cookies.token;

    // token not found, so login again
    if (!token)
      return res.status(401).json({
        message: "user not authenticated",
      });

    // verify token
    const decode = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    if (!decode) {
      return res.status(401).json({ message: "invalid token" });
    }
    
    // decode will contain the data used while signing
    // in our case this
    // const tokenData = {
    //   userId: user._id,
    // };

    req.id = decode.userId;
    
    next();
  } catch (error) {
    console.log(error);
  }
};

export default isAuthenticated;
