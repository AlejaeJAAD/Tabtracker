const User = require('../models/User');

module.exports = {
    async show (req, res) {
        try {
            const users = await User.find({},
                {
                    _id : 1, 
                    email : 1 
                },
            )
            res.status(200).json(users)
        } catch (err) {
            res.status(500).send({
                error: 'An error has occured trying to fetch the songs'
            })
        }
    }
}