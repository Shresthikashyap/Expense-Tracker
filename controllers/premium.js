const User = require('../models/user')
const sequelize = require('../util/database')

const leaderBoard = async(req,res) => {
   const t = await sequelize.transaction();
      
      const page = parseInt(req.query.page)|| 1; // Get page number from query params, default to 1
      const limit = parseInt(req.query.limit)|| parseInt(req.query.pageSize); // Get limit from query params, default to 10
      const offset = (page - 1) * limit; // Calculate offset based on page and limit

    try{

      const leaderboardofuser = await User.findAll({
        attributes: [
          'id',
          'name','email','isPremium', 'totalExpense',
          [sequelize.literal('(SELECT SUM(totalExpense) FROM users)'), 'totalExpenseSum']],

        order:[['totalExpense','DESC']],
        limit,
        offset
        
      },{transaction:t}); 

      await t.commit();

      console.log('yyyyyy',leaderboardofuser);
      
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