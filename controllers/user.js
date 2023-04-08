const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const sequelize = require('../util/database');

exports.addUser = async(req, res) => {
  const t = await sequelize.transaction();
  try{
      const {name, email, password }= req.body;

      const hashedPassword = await bcrypt.hash(password, 10); 
      
      const newUser = await User.create({name: name, email: email, password: hashedPassword},{transaction: t});

      const payload = newUser.dataValues;
      const token = jwt.sign(payload,'mySecretKey')
      
      await t.commit();
      res.status(201).json({ token: token });
      
  }
  catch(err){
      await t.rollback();
       
      if (Error) {
          res.status(500).json({ error: 'Email already taken' });
      } else {
          console.log(err);
          res.status(500).json({ error: 'Something went wrong' });
      }    
  }
}

exports.getLogin = async(req, res) =>{
    const t = await sequelize.transaction();
    try{
    
    const {email, password} = req.body;
   
    if (email=='undefined' || password == 'undefined') {
      console.log('user is missing');
      return res.status(400).json({ error: 'User not found' });
    }
    
    const user = await User.findOne({ where: { email } },{transaction: t});
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }  
    
    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log(passwordMatch)
    if(!passwordMatch){
      return res.status(401).json({error: 'User not authorized'});
    }
    
    // Making our payload
    const payload = user.dataValues;
    const token = jwt.sign(payload, 'mySecretKey');
    
   await t.commit();
    res.status(200).send({ token: token});
     
    }
    catch (err) {
      await t.rollback();
    res.status(500).json({ error: err });
    }
};
