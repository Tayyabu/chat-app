const { z } = require("zod");

const userSchema = z.object({
  email: z.string().email({message:"Enter valid Email"}).min(3).max(109),
  password: z.string().min(8),
});



module.exports ={userSchema}