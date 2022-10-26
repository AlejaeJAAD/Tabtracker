const User = require('../models/User');

module.exports = {
    async show (req, res) {
        const token = req.header('auth-token')
        if(!token) {
            res.status(403)
                .send({
                    message: 'Invalid JWT token'
                })
        }
        if(req.user.role == 'admin') {
            try {
                const users = await User.find({},
                    {
                        _id : 1, 
                        firstName: 1,
                        email : 1 ,
                        role: 1
                    },
                )
                res.status(200).send({
                    message: 'Congrats! but there is no hidden content',
                    users
                })
            } catch (err) {
                res.status(500).send({
                    error: 'An error has occured trying to fetch the registered users'
                })
            }
        } else {
            res.status(200)
                .send({
                    message: 'User is authenticated, but its not authorized to visualize this content'
                })
        }

    }
}