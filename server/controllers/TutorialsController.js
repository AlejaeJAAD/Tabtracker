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
    
    //Post tutorial with user
    async postTutorial (req, res) {
        if (!req.body.title) {
            res.status(400).send({ message: "Content can not be empty!" });
            return;
          }

        try {
            const tutorial = new Tutorial({
                title: req.body.title,
                description: req.body.description,
                published: req.body.published ? req.body.published : false,
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
    },

    //Get one tutorial
    async getOneTutorial (req, res) {
        const id = req.params.id

        await Tutorial.findById(id)
            .then(data => {
                if (!data)
                    res.status(404).send({
                        message: `Tutorial not found with the id: ${id}`
                    })
                else res.send(data)
            })
            .catch(err => {
                res.status(500).send({
                    message: `Error retrieving tutorial with the id: ${id}`
                })
            })
    },
    
    //Update one tutorial
    async updateOneTutorial (req, res) {
        if (!req.body) {
            return res.status(400).send({
                message: 'Data to update can not be empty'
            })
        }

        const id = req.params.id

        await Tutorial.findByIdAndUpdate(id, req.body, {
            useFindAndModify: false
        })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update Tutorial with id: ${id}.`
                })
            } else res.send({
                message: 'Tutorial was updated successfully.'
            })
        })
        .catch(err => {
            res.status(500).send({
                message: `Error updating Tutorial with the id ${id}`
            })
        })
    },

    //Delete one tutorial
    async deleteOneTutorial (req, res) {
        const id = req.params.id

        await Tutorial.findByIdAndRemove(id)
            .then(data => {
                if (!data) {
                    res.status(404).send({
                        message: `Cannot delete the Tutorial with the id: ${id}.`
                    })
                } else {
                    res.send({
                        message: "Tutorial was deleted successfully"
                    })
                }
            })
            .catch(err => {
                res.status(500).send({
                    message: `Could not deleted the tutorial with the id: ${id}`
                })
            })
    },

    //Delete all tutorials
    async deleteAllTutorials (req, res) {
        await Tutorial.deleteMany({})
            .then(data => {
                res.send({
                    message: `${data.deletedCound} tutorials were deleted successfully`
                })
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while removing all the tutorials."
                })
            })
    },

    //Get tutorial by title
    async getByTttle (req, res) {
        const { page, size } = req.query
        const findTutorial = req.params.tutorialName;
    
        var condition = findTutorial
            ? { title: { $regex: new RegExp(findTutorial), $options: "i"}}
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
                    err.message || 'Some error occurred while retrieving tutorials with that title.'
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



}