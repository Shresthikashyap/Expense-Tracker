const User = require('../models/user')
const Expense = require('../models/Expense');
const downloadedFile = require('../models/downloadedFile');
const S3Service = require('../services/S3services')
const UserServices = require('../services/userservices')
const sequelize = require('../util/database');

/************   Add Expense   **********/
const addExpense = async(req, res) => {
  const t = await sequelize.transaction();
   
  try {
   
    const {cost ,desc ,cat} = req.body;

    if(cost == undefined || cost.length === 0){
       return res.status(400).json({success:false, message:'parameter missing'})
    }
   
    let expense = await Expense.create({ cost: cost, description: desc, category: cat, userId: req.user.id},{transaction:t});
    const totalExpense = Number(req.user.totalExpense) + Number(cost);
    
    await User.update({totalExpense:totalExpense},{where: {id: req.user.id}, transaction:t})
    await t.commit();

    res.status(201).json({ expense, success:true });
  } 
  catch (err) { 
    console.log(err);
    await t.rollback();
    res.status(500).json({ error: err });
  }
};

/**************  get all expenses of database  *************/
const getExpenses = async(req, res) => {
  
    const t = await sequelize.transaction();  
    try {
    
    const expenses = await Expense.findAll({where:{userId: req.user.id},transaction:t});

    await t.commit();
    res.status(200).json({ expenses, success: true });

  } 
  catch (err) {
    console.log(err);
    t.rollback();
    res.status(500).json({ error: err });
  }
};


/******************   download expenses **********************/
const downloadExpenses = async(req,res) => {
  try{
    
    const expenses = await UserServices.getExpenses(req);
 
    const stringifiedExpenses = JSON.stringify(expenses);

    const userId = req.user.id;

    const fileName = `Expense${userId}/${new Date()}.txt`;   

    const fileUrl = await S3Service.uploadToS3(stringifiedExpenses, fileName);
    
    
    await downloadedFile.create({userId: req.user.id, url: fileUrl});

    res.status(200).json({fileUrl, success: true});
  }
  catch(err){
    res.status(500).json({fileUrl:'',success:false,err:err})
  }
    
}

/************Update expense *************/
const updateExpense = async(req,res) =>{
   const t = await sequelize.transaction();
  
  try {

    const id = req.params.id;
    if (id == 'undefined'){
      return res.status(400).json({ err: 'Id is missing' });
    }

    const expense = await Expense.findByPk(id);
    const {cost, desc, cat } = req.body;  

    const updatedExpense = Number(req.user.totalExpense) - Number(expense.cost); 
    const totalExpense = Number(updatedExpense) + Number(cost);
    await User.update({totalExpense:totalExpense},{where: {id: req.user.id}, transaction:t})

    const updatedExpenseDetail = await expense.update({ cost:cost, description:desc, category:cat},{transaction:t}); 

    await t.commit();

    res.status(201).json({ expense : updatedExpenseDetail });

  } catch (err) {
     await t.rollback();
    res.status(500).json({ error: err });
  }
}

/***************     delete the expenses  ******************/
const deleteExpense = async(req, res) => {
    
  const t = await sequelize.transaction();
  try {
    const id = req.params.id;
    //const {cost} = req.body; 

    if (id=='undefined') {
      console.log('ID is missing');
      return res.status(400).json({ err: 'Id is missing' });
    }

    const expense = await Expense.findByPk(id,{transaction:t});
   
    if (!expense) {  
      return res.status(404).json({ err: 'Expense not found' });  
    } 
    console.log(expense.cost)
    
    const totalExpense = Number(req.user.totalExpense) - Number(expense.cost);
    console.log('======>',req.user.totalExpense, ' ',expense.cost)
   
    await expense.destroy({ where: { id: id},transaction:t});
    
    if(totalExpense >= 0){
      await User.update({totalExpense:totalExpense},{where: {id: req.user.id}, transaction:t})
    }
    
    await t.commit();
    
    res.status(200).json({ success:true });
  } 
  catch (err) {
    await t.rollback();
    res.status(500).json({ error: err });
  }
};

module.exports={
  addExpense, getExpenses, downloadExpenses, updateExpense, deleteExpense
}