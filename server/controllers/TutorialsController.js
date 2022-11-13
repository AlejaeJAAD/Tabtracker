const Tutorial = require('../models/Tutorial')

const getPagination = (page, size) => {
    const limit = size ? +size : 3
    const offset = page ? page * limit : 0

    return { limit, offset }
}

module.exports = {
    //Get all tutorials
    async getAllTutorials (req, res) {
        const { page, size, title } = req.query
        var condition = title
            ? { title: { $regex: new RegExp(title), $options: "i"}}
            : {}

        const { limit, offset } = getPagination(page, size)

        await Tutorial.paginate(condition, { offset, limit})
            .then((data) => {
                res.send({
                    totalItems: data.totalDocs,
                    tutorials: data.docs,
                    totalPages: data.totalPages,
                    currentPage: data.page - 1
                })
            })
            .catch((err) => {
                res.status(500).send({
                    message:
                        err.message || 'Some error occurred while retrieving tutorials.'
                })
            })
    },

    //Get all the published tutorials
    async getAllPublishedTutorials (req, res) {
        const { page, size } = req.query
        const { limit, offset } = getPagination(page, size)

        await Tutorial.paginate({ published: true}, {offset, limit})
            .then((data) => {
                res.send({
                    totalItems: data.totalDocs,
                    tutorials: data.docs,
                    totalPages: data.totalPages,
                    currentPage: data.page - 1
                })
            })
            .catch((err) => {
                res.status(500).send({
                    message:
                        err.message || 'Some error occurred while retrieving published tutorials.'
                })
            })
    },

    //Post tutorial with user
    async postTutorial (req, res) {
        try {
            const tutorial = new Tutorial({
                title: req.body.title,
                description: req.body.description,
                published: req.body.published,
                uid: req.uid
            })

            const newTutorial = await tutorial.save()
            res.json({
                newTutorial
            })
        } catch (err) {
            return res.status(500).json({
                error: 'Some error with the server'
            })
        }
    }
}