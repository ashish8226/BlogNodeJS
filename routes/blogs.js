const express = require('express')

const Blog = require('../schema/blog');


const router = express.Router();


const blogController = require('../controller/blog')

const checkAuth = require('../middleware/check-auth')
const extractFile = require('../middleware/file')


router.get('/', blogController.getPosts);
router.post('/', checkAuth, extractFile, blogController.addPost);

router.route('/:id')
    .get(blogController.getPost)
    .delete(checkAuth, blogController.deletePost)
    .put(checkAuth, extractFile, blogController.updatePost);

module.exports = router;