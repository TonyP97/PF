const express = require('express');
const router = express.Router();
const {Table,User} = require('../db.js');



const getTable=async()=>{
    return await Table.findAll({
        include:{
            model:User,
            attributes:['user','password','email','photo','admin'],
            through:{
                attributes:['num_Table','state','chairs']
            }
        }
    })
}

router.get("/table",async (req,res)=>{
    res.json(await getTable())
})

router.get("/:id",async(req,res)=>{
    const {id}=req.params;
    try{
        const table=await Table.findByPk(id,{
            include:{
                model:User
            }
        })
        if(table===null){
            res.status(404).json("Error in user by id")
        }
        else{
            res.status(200).json(table)
        }
       
    }catch(error){
        console.log("/routes/table/:id get error",error);
      res.status(500).json({error:"ID_ERROR",description: "Error found ID"} )
        }
})

router.post('/table', async (req,res)=>{
    const {num_Table,state,chairs}=req.body;
    try{
        const table=await Table.create({
            num_Table:num_Table,
            state:state,
            chairs:chairs
        }
        )
        ?res.status(200).json("La mesa ha sido creado correctamente", table)
           :res.status(403).json("La mesa no se ha creado");
    }catch(error){
        res.status(403).json(error)
    }
})


module.exports = router;