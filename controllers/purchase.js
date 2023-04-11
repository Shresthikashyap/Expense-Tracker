const Razorpay = require('razorpay');
const Order = require('../models/order');
const sequelize = require('../util/database');

const purchasePremium = async(req,res)=>{
   const t = await sequelize.transaction();
   try{
    var rzp = new Razorpay({
      key_id: 'rzp_test_aypy6xxrnAbUXy',
      key_secret: 'HSqnGr3S5gbuftikUQcFAnHd'
    })
    
    const amount = 2000;
    
    rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
       if (err) {
         throw new Error(JSON.stringify(err));
       }

       await req.user.createOrder({ orderId: order.id, status: "PENDING" }, { transaction: t });
       await t.commit();
       return res.status(201).json({ order, key_id: rzp.key_id });
     })
   }
   catch(err){
        await t.rollback();
        res.status(401).json({message:'Something went wrong',error: err});
   }
}

const updateTransactionStatus = async(req,res)=>{
   const t = await sequelize.transaction();
   try{

    const {payment_id,order_id} = req.body; 
    const id = req.user.id;
    const Promise1 = await Order.create({ orderid: order_id , paymentid: payment_id,status : 'successful'},{transaction: t});

    //const Promise1 = order.update({ paymentid: payment_id, status: 'successful' });
    
    const Promise2 = await req.user.update({isPremium: true},{ transaction: t });
    const Promise3 = await req.user.update({orderId: order_id}, {where: {id: req.user.id}},{ transaction: t });
    
    Promise.all([Promise1,Promise2,Promise3])
    await t.commit();
    return res.status(202).json({ success: true, message: 'Transaction completed' });
      
   }
   catch(err){
    await t.rollback();
    throw new Error(err)
   }
}

module.exports = {
    purchasePremium,
    updateTransactionStatus
}