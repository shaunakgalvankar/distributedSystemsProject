import express from 'express';
const router = express.Router();

router.post('/api/auth/signout',(req,res)=>{
    req.session = null;
    res.send({message:'Successfully Logout'});
});

export { router as signOutRouter };