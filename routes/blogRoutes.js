const express = require('express');
const multer = require('multer')
const router = express.Router();
const Blog = require('../models/Blog');
const mongoose = require('mongoose');
const { User } = require('../models/user');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/:id/comments',  async (req,res) => {
    try{
         const blog = await Blog.findById(req.params.id);
         if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
         } 

         const comment = {
            author: req.body.author,
            text: req.body.text,
            userId: req.body.userId,
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

router.put('/:id/comments/:commentId', async (req,res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found'})
        }

        const comment = blog.comment.id(req.params.commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' })
        }
        comment.text = req.body.text || comment.text;

        await blog.save()

        console.log('Updated blog with comment:', blog);

        res.status(200).json(blog)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

router.post('/:id/comments/:commentId/replies', async (req,res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found'})
        }

        const comment = blog.comment.id(req.params.commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' })
        }
        comment.replies.push({
            author: req.body.author,
            text:req.body.text,
            userId: req.body.userId
        });

        await blog.save()

        console.log('Updated blog with comment:', blog);

        res.status(200).json(blog)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})



router.get('/', async(req, res) => {
    try { 
        const { query, page  } = req.query;
        const itemsPerPage = 20;
        const currentPage = parseInt(page) || 1;
        let blogs;
        if (query) {
            blogs = await Blog.find({ $text: { $search: query }})
            .skip((currentPage -1) * itemsPerPage)
            .limit(itemsPerPage);
        } 
    res.json(blogs) 
    }
     catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/search', async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ message: 'Search query is required' });
        }
        const results = await Blog.find({ $text: { $search: query } });
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
})


router.get('/:_id', async(req, res) => {
    try { 
        const blogs = await Blog.find({_id: req.params._id});
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/:id/increment-views', async (req, res) => {
    const blogId = req.params.id;
    console.log(blogId, 'hh')
    try{
        const blog = await Blog.findById(blogId);

        if (!blog) {
            return res.status(404).json({ error: 'Blog not found'})
        }

        blog.views += 1;
        await blog.save();

        res.json({ message: 'Views increment successfully', views: blog.views})
    } catch(error) {
        console.error('Error incrementing views', error);
        res.status(500).json({ error: 'Internal server error'})
    }
})



router.get('/user/:userId', async (req, res) => {
    try {
        const blog = await Blog.find({userId: req.params.userId});
        res.json(blog);
    } catch(error) {    
        res.status(500).json({ message: error.message });
    }
});

router.post('/image', upload.single('file'), (req,res) => {
    
    const imageUrl = req.file ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}` : null;
    res.send({ imageUrl })  
})

router.post('/', async (req, res) => {


    const blog = new Blog({
        title: req.body.title,
        content: req.body.content,
        tags: req.body.tags,
        userId: req.body.userId,
        author: req.body.author,
        imageUrl: req.body.imageUrl,
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