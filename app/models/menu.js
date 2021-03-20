const mongoose = require('mongoose')


const menuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
        required: true,
        trim: true
    },
     price: {
        type: Number,
        required: true,
        trim: true
    },  
    size: {
        type: String,
        required: true,
        trim: true
    }  
})

const Menu = mongoose.model('Menu', menuSchema)
module.exports = Menu