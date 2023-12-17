    const mongoose = require('mongoose');

   const commentSchema = new mongoose.Schema({
    // author: { type: String, required: true },
    text:{ type: String, required:true },
    createdAt: {type: Date, default: Date.now }
   }) 

    const blogSchema = new mongoose.Schema({
        title: {type: String, required: true },
        content: { type: String, required: true },
        userId: { type: String , required: true},
        createdAt: { type: Date, default: Date.now },
        tags: {type: String},
        comment: [commentSchema]
    });

    module.exports = mongoose.model('Blog', blogSchema);

    