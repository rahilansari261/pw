const jwt = require('jsonwebtoken')

const authJWT = async (req, res, next) => {
 // prettier-ignore
 const token =req.body.token || req.query.token || req.headers['x-access-token']
 // prettier-ignore
 if(!token) return res.status(403).send({success: false,message: 'No token provided.'})
 else {
  try{
   const verifiedToken = jwt.verify(token, app.get('superSecret'))
   // prettier-ignore
   const decoded = jwt.decode(token, {complete: true,})
   req.doc = decoded.payload
   // prettier-ignore
   const newtoken = jwt.sign({ ...req.doc, create_time: new Date() },app.get('superSecret'),{expiresIn: '12h', })
   res.set('token', newtoken)
   next()
  }catch(error){
    // prettier-ignore
    return res.status(403).json({success: false,message: 'Fail to authenticate token.'})
   }
 }
}

module.exports = authJWT
