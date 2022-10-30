const Link = require('../models/Link')
var { nanoid } = require("nanoid")

module.exports = {
    async getLinks (req, res) {
        try {
            const links = await Link.find({
                ui: req.uid
            }).lean()
            return res.json({
                links
            })
        } catch (err) {
            return res.status(500).json({
                error: 'Some error with the server'
            })
        }
    },
    async createLink (req, res) {
        try {
            const { longLink } = req.body
            const link = new Link({ 
                longLink, 
                nanoLink: nanoid(6),
                uid: req.uid 
            })
            
            const newLink = await link.save()
            res.json({
                newLink 
            })
        } catch (err) {
            return res.status(500).json({
                error: 'Some error with the server'
            })
        }
    },
    async removeLink (req, res) {
        try {
            const { id } = req.params
            const link = await Link.findById(id)

            if (!link) return res.status(404).json({ error: "Link does not exists" })

            if (!link.uid.equals(req.uid))
                return res.status(401).json({ error: "This link doesn't belong to you 🤡!" })
        } catch (err) {
            console.log(err)
            if (error.kind === "ObjectId")
                return res.status(403).json({ error: "Wrong ID format" })
            return res.status(500).json({ error: "Some error with the server" })
        }
    },
    async updateLink (req, res) {
        try {
            const { id } = req.params
            let { longLink } = req.body
            if (!longLink.startsWith("https://")) {
                longLink = "https://" + longLink
            }

            const link = await Link.findById(id)

            if (!link) return res.status(404).json({ error: "Link does not exists" })

            if (!link.uid.equals(req.uid))
                return res.status(401).json({ error: "This link doesn't belong to you 🤡!" })

            link.longLink = longLink

            await link.save()

            return res.json({ link })
        } catch (err) {
            console.log(err)
        }
    },
    async getNanoLink (req, res) {
        try {
            const { nanoLink } = req.params
            console.log(req.params)
            const link = await Link.findById( nanoLink )
            console.log(link)
    
            if (!link) return res.status(404).json({ error: "Link does not exists" })
    
            return res.json({ 
                link
            })
        } catch (error) {
            console.log(error)
            if (error.kind === "ObjectId") {
                return res.status(403).json({ error: "Wrong ID format" })
            }
            return res.status(500).json({ error: "Some error with the server" })
        }
    }
}