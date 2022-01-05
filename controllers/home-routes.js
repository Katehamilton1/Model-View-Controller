const router = require('express').Router();
const sequelize = require('../config/connection');
const {
    User,
    Post,
    Comment
} = require('../models');




router.get('/', (request, response) => {
    Post.findAll({
        attributes: [
            'id',
            'title',
            'content',
            'created_at'],
        include: [
            {
                model: Comment,
                attributes: [
                    'id',
                    'comment_text',
                    'post_id',
                    'user_id',
                    'created_at'],
                include: {
                    model: User,
                    attributes: ['id',
                     'comment_text', 
                     'post_id', 'user_id',
                      'created_at'],
                },
            },
            {
                model: User,
                attributes: ['username'],
            },
        ],
    })
        .then((postData) => {
            const posts = postData.map(post => post.get({
                 plain: true 
                }));
            response.render('homepage', {
                posts,
                loggedIn: request.session.loggedIn
            });
        })
        .catch((err) => {
            console.log(err);
            response.status(500).json(err);
        });
});

router.get('/post/:id', (request, response) => {

    Post.findOne({
        where: {
            id: request.params.id,
        },
        attributes: [
            'id',
            'content',
            'title',
            'created_at'],
        include: [
            {
                model: Comment,
                attributes: [
                    'id',
                    'comment_text',
                    'post_id',
                    'user_id',
                    'created_at'],
                include: {
                    model: User,
                    attributes: ['username'],
                },
            },
            {
                model: User,
                attributes: ['username'],
            },
        ],
    })
        .then((postData) => {
            if (!postData) {
                response.status(404).json({ message: 'No post found with this id' });
                return;
            }

            const post = postData.get({
                 plain: true 
                });
            response.render('single-post', {
                post,
                loggedIn: request.session.loggedIn
            });
        })
        .catch((err) => {
            console.log(err);
            response.status(500).json(err);
        });
});

router.get('/login', (request, response) => {
    if (request.session.loggedIn) {
        res.redirect('/');
        return;
    }

    res.render('login');
});

router.get('/signup', (request, response) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }

    res.render('signup');
});

module.exports = router;


