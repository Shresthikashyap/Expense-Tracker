const uuid = require('uuid');
const Sib = require('sib-api-v3-sdk');
const validator = require('validator');
//const sgMail = require('@sendgrid/mail');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const Forgotpassword = require('../models/forgotpassword');

const forgotpassword = async (req, res) => {
    try {

        const client = Sib.ApiClient.instance;
        const apiKey = client.authentications['api-key'];
        apiKey.apiKey = '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';
        const transEmailApi = new Sib.TransactionalEmailsApi();
        
        const { email } =  req.body;
        const user = await User.findOne({where : { email }});
        if(user){  
            const id = uuid.v4();
            user.createForgotpassword({ id , active: true })

            if (!validator.isEmail(email.toLowerCase())) {
                    return res.status(400).json({ error: 'Invalid email address' });
            }
             console.log('******************************',id);
            const sender = {email:'anjaliradcliffe7@gmail.com'};
            const receiver = [{ email }];

            //sgMail.setApiKey('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')
            //console.log('****************************id',id)
            const msg = {
                sender,
                to: receiver,
                subject: 'Password reset request for your account',
                textContent: 'We received a request to reset the password for your account. Please follow the link below to reset your password:',
                htmlContent: `<p>Hello,</p>
                <p>We received a request to reset the password for your account. Please follow the link below to reset your password:</p>
                <p><a href="http://localhost:3000/password/resetpassword/${id}">Reset Password</a></p><p>If you did not request this password reset, please ignore this email and contact us immediately.</p><p>Thank you,
                </p><p>Expensify</p>`
            }
            
            
            // sgMail
            // .send(msg,(err=>{
            //      console.log('here*************',err)
            // }))
            const response = transEmailApi.sendTransacEmail(msg)
            .then((response) => {

                // console.log(response[0].statusCode)
                // console.log(response[0].headers)
                return res.status(response[0].statusCode).json({message: 'Link to reset password sent to your mail ', success: true})

            })
            .catch((error) => {
                console.log(error)
                throw new Error(error);
            })

            //send mail
        }else {
            throw new Error('User doesnt exist')
        }
    } catch(err){
        console.error(err)
        return res.json({ message: err, success: false });
    }
}

const resetpassword = (req, res) => {
    const id =  req.params.id;
    console.log(id)
    Forgotpassword.findOne({ where : { id }}).then(forgotpasswordrequest => {
        if(forgotpasswordrequest){
            forgotpasswordrequest.update({ active: false});
            res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>
                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`
                                )
            res.end();
        }
    })
}

const updatepassword = (req, res) => {

    try {
        const { newpassword } = req.query;
        const { resetpasswordid } = req.params;
        Forgotpassword.findOne({ where : { id: resetpasswordid }}).then(resetpasswordrequest => {
            User.findOne({where: { id : resetpasswordrequest.userId}}).then(user => {
                // console.log('userDetails', user)
                if(user) {
                    //encrypt the password

                    const saltRounds = 10;
                    bcrypt.genSalt(saltRounds, function(err, salt) {
                        if(err){
                            console.log(err);
                            throw new Error(err);
                        }
                        bcrypt.hash(newpassword, salt, function(err, hash) {
                            // Store hash in your password DB.
                            if(err){
                                console.log(err);
                                throw new Error(err);
                            }
                            user.update({ password: hash }).then(() => {
                                res.status(201).json({message: 'Successfuly update the new password'})
                            })
                        });
                    });
            } else{
                return res.status(404).json({ error: 'No user Exists', success: false})
            }
            })
        })
    } catch(error){
        return res.status(403).json({ error, success: false } )
    }

}


module.exports = {
    forgotpassword,
    updatepassword,
    resetpassword
}