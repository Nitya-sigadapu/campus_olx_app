const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function generateOTP(){
  return Math.floor(100000 + Math.random()*900000).toString();
}


// ---------------- SIGNUP ----------------
exports.signup = async (req,res)=>{

  console.log("Signup request:", req.body);

  const { email, password,contact } = req.body;

  if(!email || !password){
    return res.status(400).json({
      message:"Email and password required"
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters long"
    });
  }

  if(!email.endsWith("@iiti.ac.in")){
    return res.status(400).json({
      message:"Use your institute email (@iiti.ac.in)"
    });
  }

  const name = email.split("@")[0];

  db.query(
    "SELECT * FROM users WHERE email=?",
    [email],
    async (err,result)=>{

      if(err){
        console.log(err);
        return res.status(500).json(err);
      }

      if(result.length > 0){

  const otp = generateOTP();
  console.log("Generated OTP:", otp);

  db.query(
    "UPDATE users SET otp=?, verified=false WHERE email=?",
    [otp,email],
    (err)=>{
      if(err) return res.status(500).json(err);

      return res.json({
        message:"OTP resent. Enter OTP."
      });
    }
  );

  return;
}

      const hashed = await bcrypt.hash(password,10);

      const otp = generateOTP();
      console.log("Generated OTP:", otp);

      db.query(
        "INSERT INTO users (name,email,password,contact,otp,verified) VALUES (?,?,?,?,?,false)",
        [name,email,hashed,contact,otp],
        (err)=>{

          if(err){
            console.log(err);
            return res.status(500).json(err);
          }

          res.json({
            message:"Signup successful. Enter OTP."
          });

        }
      );

    }
  );
};



// ---------------- VERIFY OTP ----------------
exports.verifyOTP = (req,res)=>{

  const { email,otp } = req.body;

  db.query(
    "SELECT * FROM users WHERE email=?",
    [email],
    (err,result)=>{

      if(err){
        console.log(err);
        return res.status(500).json(err);
      }

      const user = result[0];

      if(!user){
        return res.status(404).json({
          message:"User not found"
        });
      }

      if(String(user.otp).trim() !== String(otp).trim()){
        return res.status(400).json({
          message:"Invalid OTP"
        });
      }

      db.query(
        "UPDATE users SET verified=true, otp=NULL WHERE email=?",
        [email],
        (err)=>{

          if(err){
            console.log(err);
            return res.status(500).json(err);
          }

          res.json({
            message:"OTP verified successfully"
          });

        }
      );

    }
  );
};


// ---------------- LOGIN ----------------
exports.login = (req,res)=>{

  const { email,password } = req.body;

  if(!email.endsWith("@iiti.ac.in")){
    return res.status(400).json({
      message:"Login with institute mail id"
    });
  }

  db.query(
    "SELECT * FROM users WHERE email=?",
    [email],
    async (err,result)=>{

      if(err){
        console.log(err);
        return res.status(500).json({message:"Server error"});
      }

      const user = result[0];

      if(!user){
        return res.status(404).json({message:"User not found"});
      }

      if(!user.verified){
        return res.status(403).json({message:"Please verify OTP first"});
      }

      const match = await bcrypt.compare(password,user.password);

      if(!match){
        return res.status(401).json({message:"Incorrect password"});
      }

      const token = jwt.sign(
        {id:user.id,email:user.email},
        "secretkey",
        {expiresIn:"7d"}
      );

      res.json({
        message:"Login success",
        token,
        user:{
          id:user.id,
          email:user.email,
          name:user.name
        }
      });

    }
  );

};