const User = require('../models/user')
const Expense = require('../models/Expense');
const sequelize = require('../util/database')

/*************  leadership chart  ****************/
const leaderBoard = async(req,res) => {
   const t = await sequelize.transaction();
      console.log('**********',req.query.page)
      console.log('**********',req.query.pageSize)
      const page = parseInt(req.query.page)|| 1; // Get page number from query params, default to 1
      const limit = parseInt(req.query.limit)|| parseInt(req.query.pageSize); // Get limit from query params, default to 10
      const offset = (page - 1) * limit; // Calculate offset based on page and limit

    try{

      const leaderboardofuser = await User.findAll({
        attributes: [
          'id',
          'name','email','isPremium', 'totalExpense',
          [sequelize.literal('(SELECT SUM(totalExpense) FROM users)'), 'totalExpenseSum']],

          //sequelize.fn['sum',total]],
        // include: [
        //   {
        //     model: Expense,
        //     attributes: ['description', 'category', 'cost'],
        //     order:['cost','DESC']    
        //   }
        // ],
        order:[['totalExpense','DESC']],
        limit,
        offset
        
      },{transaction:t}); 

      // const expenses = await Expense.findAll();
      // const userAggregatedExpenses = {};
        
      // expenses.forEach((expense)=>{
  
      //   if(userAggregatedExpenses[expense.userId]){
      //     userAggregatedExpenses[expense.userId] = userAggregatedExpenses[expense.userId] + expense.cost;
      //   }else{
      //     userAggregatedExpenses[expense.userId] = expense.cost;
      //   }
      // })
     
      // var userLeaderBoardDetails = [];
      // user.forEach((user)=>{
      //    userLeaderBoardDetails.push({name:user.name,total_cost:userAggregatedExpenses[user.id]})
      // })
      
      // userLeaderBoardDetails.sort((a, b) => b.total_cost - a.total_cost);
      await t.commit();
      
      res.status(200).json({leaderboardofuser, success: true});
    }
    catch(err){
      t.rollback();
      console.log(err);
      res.status(500).json({error:err});
    }
  }

  module.exports = {
    leaderBoard
  }