export const test=(req,res)=>{
    res.json({msg:"API is working"})
}

export const updateUser=async(req,res,next)=>{
console.log(req.user);
return res.json(req.user);
}