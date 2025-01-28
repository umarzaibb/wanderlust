module.exports= (frc)=> {
    return (req,res,next)=>{
      frc(req,res,next).catch(next)
    }
}
