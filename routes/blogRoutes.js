const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const mongoose = require('mongoose');
const { User } = require('../models/user');

router.post('/:id/comments', async (req,res) => {
    try{
         const blog = await Blog.findById(req.params.id);
         if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
         } 

         const comment = {
            text: req.body.text,
         };

         blog.comment = blog.comment || []


         blog.comment.push(comment);
         await blog.save();

         console.log('Saved blog with comment:', blog); 
        

         res.status(201).json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
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

router.get('/:_id', async(req, res) => {
    try { 
        const blogs = await Blog.find({_id: req.params._id});
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



router.get('/user/:userId', async (req, res) => {
    try {
        const blog = await Blog.find({userId: req.params.userId});
        res.json(blog);
    } catch(error) {    
        res.status(500).json({ message: error.message });
    }
});

router.post('/', async (req, res) => {
    const blog = new Blog({
        title: req.body.title,
        content: req.body.content,
        tags: req.body.tags,
        userId: req.body.userId
    });

    try {
        const newBlog = await blog.save()
        console.log(newBlog, 'cccc')
        res.status(201).json(newBlog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }

})

router.put('/:_id', async(req, res) => {
    try{
        const blog = await Blog.findById(req.params._id);
        if(!blog) {
            return res.status(404).json({ message: 'Blog not found'})
        }
        const updateFields = {
             title: req.body.title,
             content: req.body.content,
        }

        await blog.updateOne({ $set: updateFields})
        res.json({ message: 'Blog updated' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//user customized selections
router.put('/topics/:userId', async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.params.userId })
        console.log(user)
        user.topics = req.body.topics
        await user.save();

        res.json({ message: 'User topics updated successfully', user: { userId: user.userId, topics: user.topics }})
    }   catch(error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' })
    }
})


router.delete('/:_id', async(req,res) => {
    try {
        const blog = await Blog.findById(req.params._id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        const reqUserId = req.body.userId;

        if (blog.userId !== reqUserId) {
        console.log(blog, reqUserId, 'bloguserId and reqUserId')
            return res.status(403).json({ message: 'Permission denied' });
        }
        console.log(blog, 'blog....')
        await blog.deleteOne();
        res.json({ message: 'Blog deleted' });
    } catch (error) {
        res.status(500).json( { message: error.message})
    }
});
        

module.exports = router;