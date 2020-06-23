const Blog = require('../schema/blog');
exports.getPosts = (req, res, next) => {
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.page;
    const postQuery = Blog.find();
    let fetchedBlogs;
    if (pageSize && currentPage) {
        postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
        // console.log(pageSize, currentPage);
    }
    postQuery.then(documents => {
        fetchedBlogs = documents;
        return Blog.count();
    }).then(count => {
        res.status(200).json({
            message: "fetched blogs successfully",
            posts: fetchedBlogs,
            maxPosts: count
        });
    }).catch(err => {
        res.status(500).json({
            message: "Fetching posts failed"
        })
    });

}
exports.addPost = (req, res, next) => {
    const url = req.protocol + '://' + req.get("host");
    const blog = new Blog({
        title: req.body.title,
        description: req.body.description,
        imagePath: url + "/images/" + req.file.filename,
        creator: req.userData.userId
    });
    console.log(blog);
    blog.save().then(createdPost => {
        res.status(201).json({
            message: "blog added successfully",
            post: {
                id: createdPost._id,
                ...createdPost
            }
        })
    }).catch(err => {
        res.status(404).json({
            message: "Creating post failed!!"
        });

    });
}
exports.getPost = (req, res) => {
    Blog.findById(req.params.id).then(post => {
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({
                message: 'Post not found'
            });
        }
    }).catch(err => {
        res.status(500).json({
            message: "fetching post failed"
        })
    });
}
exports.deletePost = (req, res) => {
    Blog.deleteOne({
        _id: req.params.id,
        creator: req.userData.userId
    }).then(result => {

        if (result.n > 0) {

            res.status(200).json({
                message: "Deletion successful"
            });
        } else {

            res.status(401).json({
                message: "not authorized"
            });
        }
    }).catch(err => {

        res.status(500).json({
            message: "Fetching posts failed"
        })
    })
}

exports.updatePost = (req, res) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
        const url = req.protocol + '://' + req.get("host");
        console.log('file changed');
        imagePath = url + "/images/" + req.file.filename
    }
    const blog = new Blog({
        _id: req.body.id,
        title: req.body.title,
        description: req.body.description,
        imagePath: imagePath,
        creator: req.userData.userId
    });
    Blog.updateOne({
        _id: req.params.id,
        creator: req.userData.userId
    }, blog).then(result => {
        if (result.n > 0) {
            res.status(200).json({
                message: "Update successful",
                post: blog
            });
        } else {
            res.status(401).json({
                message: "not authorized"
            });
        }

    }).catch(err => {
        res.status(500).json({
            message: "couldn't update post"
        })
    })
}