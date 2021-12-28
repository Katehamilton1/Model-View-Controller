const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const Auth = require('../../utils/auth');


//Get all comments
router.get("/", (request, response) => {
    Comment.findAll()
        .then((dbCommentData) => response.json(dbCommentData))
        .catch((err) => {
            console.log(err);
            response.status(500).json(err);
        });
});

//Create a comment
router.post('/', (request, response) => {
    if (request.session) {
        Comment.create({
                comment_text: request.body.comment_text,
                post_id: request.body.post_id,
                user_id: request.session.user_id
            })
            .then(dbCommentData => response.json(dbCommentData))
            .catch(err => {
                console.log(err);
                response.status(400).json(err);
            });
    }
});



module.exports = router;