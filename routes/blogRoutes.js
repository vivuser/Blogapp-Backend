const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');

router.post('/:id/comments', async (req,res) => {
    try{
         const blog = await Blog.findById(req.params.id);
         if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
         } 

         blog.comments = blog.comments || [];

         const comment = {
            // author: req.body.author,
            text: req.body.text,
         };

         console.log('Adding comment:', comment);
         blog.comments.push(comment);
         await blog.save();

         console.log('Saved blog with comment:', blog); 
        

         res.status(201).json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.get('/:id/comments', async(req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if(!blog) {
            return res.status(404).json({ message: 'Blog not found' })
        }
        res.status(200).json(blog.coments | []);
    } catch(error) {
        res.status(500).json({ message: error.message});
    }
});


router.get('/', async(req, res) => {
    try { 
        const blogs = await Blog.find();
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        res.json(blog);
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', async (req, res) => {
    const blog = new Blog({
        title: req.body.title,
        content: req.body.content
    });

    try {
        const newBlog = await blog.save()
        console.log(newBlog, 'cccc')
        res.status(201).json(newBlog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }

})

router.delete(':/id', async(req,res) => {
    try {
        await Blog.findByIdAndDelete(req.params.id);
        res.json( { message: 'Blog deleted'});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

module.exports = router;