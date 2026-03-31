import * as userModels from "../models/users.model.js"

// export async function register(req, res) {
//     try{
//         const data = req.body

//     }catch(err){
//         res.status(500).json({
//         success: false,
//         message: err.message
//     });
//     }
// }

export async function login(req, res) {
    try{
        const {email , password} = req.body
        const user = await userModels.getuserbyEmail(req.email)
        
        if (email !== user.email || password !== user.password) {
          return res.status(400).json({
            success: false,
            message: "Wrong email or password"
          });
        }

       const result = {
         name: user.name,
         email: user.email
       }
       res.json({
         success: true,
         message: "Login success",
         results : result
    });


    }catch(err){
      res.status(500).json({
      success: false,
      message: err.message
    });
    }
}