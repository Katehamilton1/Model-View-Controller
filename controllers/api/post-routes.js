const router = require('express').Router();
const { request } = require('http');
const {User, Post, Comment } = require('../../models');
const withAuth = require('../../utils/auth');


 
// Create a post
router.post("/", (request, response) => {
    console.log(request.session.user_id);
    Post.create({
        title: request.body.title,
        content: request.body.post_content,
        user_id: request.session.user_id
    })
        .then((postData) => response.json(postData))
        .catch((err) => {
            console.log(err);
            response.status(500).json(err);
        });
});

// Update a post
router.put("/:id",  (request, response) => {
    Post.update({
        title: request.body.title,
        content: request.body.post_content,
    }, {
        where: {
            id: request.params.id,
        },
    })
        .then((postData) => {
            if (!postData) {
                response.status(404).json({
                    message: "No post found with this id"
                });
                return;
            }
            response.json(postData);
        })
        .catch((err) => {
            console.log(err);
            response.status(500).json(err);
        });
});

//Delete a post
router.delete("/:id", withAuth, (request, response) => {
    Post.destroy({
        where: {
            id: request.params.id,
        },
    })
        .then((postData) => {
            if (!postData) {
                response.status(404).json({
                    message: "No post found with this id"
                });
                return;
            }
            response.json(postData);
        })
        .catch((err) => {
            console.log(err);
            response.status(500).json(err);
        });
});
module.exports = router;