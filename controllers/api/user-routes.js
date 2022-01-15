const router = require('express').Router();
const { User, Post, Comment } = require('../../models');



// Get all posts
router.get('/', (request, response) => {
    User.findAll({
            attributes: { exclude: ['[password'] }
        })
        .then(userData => response.json(userData))
        .catch(err => {
            console.log(err);
            response.status(500).json(err);
        });
});

// Get one user by id
router.get('/:id', (request, response) => {
    User.findOne({
            attributes: { exclude: ['password'] },
            where: {
                id: request.params.id
            },
            include: [{
                    model: Post,
                    attributes: [
                        'id',
                        'title',
                        'content',
                        'created_at'
                    ]
                },

                {
                    model: Comment,
                    attributes: ['id', 'comment_text', 'created_at'],
                    include: {
                        model: Post,
                        attributes: ['title']
                    }
                },
                {
                    model: Post,
                    attributes: ['title'],
                }
            ]
        })
        .then(userData => {
            if (!userData) {
                response.status(404).json({ message: 'No user found with this id' });
                return;
            }
            response.json(userData);
        })
        .catch(err => {
            console.log(err);
            response.status(500).json(err);
        });
});

// Create a user
router.post('/', (request, response) => {

    User.create({
        username: request.body.username,
        password: request.body.password
    })

    .then(userData => {
            request.session.save(() => {
                request.session.user_id = userData.id;
                request.session.username = userData.username;
                request.session.loggedIn = true;

                response.json(userData);
            });
        })
        .catch(err => {
            console.log(err);
            response.status(500).json(err);
        });
});


router.post('/login', (request, response) => {
    User.findOne({
            where: {
                username: request.body.username
            }
        })
        .then(userData => {
            if (!userData) {
                response.status(400).json({
                    message: 'No user with that username!'
                });
                return;
            }

            request.session.save(() => {
                request.session.user_id = userData.id;
                request.session.username = userData.username;
                request.session.loggedIn = true;

                response.json({
                    user: userData,
                    message: 'You are now logged in!'
                });
            });

            const validPassword = userData.checkPassword(request.body.password);

            if (!validPassword) {
                response.status(400).json({
                    message: 'Incorrect password!'
                });
                return;
            }

            request.session.save(() => {
                request.session.user_id = userData.id;
                request.session.username = userData.username;
                request.session.loggedIn = true;

                response.renderjson({
                    user: userData,
                    message: 'You are now logged in!'
                });
            });
        });
});

router.post('/logout', (request, response) => {
    if (request.session.loggedIn) {
        request.session.destroy(() => {
            response.status(204).end();
        });
    } else {
        response.status(404).end();
    }
});

// Update a user
router.put('/:id', (request, response) => {

    User.update(request.body, {
            individualHooks: true,
            where: {
                id: request.params.id
            }
        })
        .then(userData => {
            if (!userData) {
                response.status(404).json({ message: 'No user found with this id' });
                return;
            }
            response.json(userData);
        })
        .catch(err => {
            console.log(err);
            response.status(500).json(err);
        });

});

// delete a user
router.delete('/:id', (request, response) => {
    User.destroy({
            where: {
                id: request.params.id
            }
        })
        .then(userData => {
            if (!userData) {
                response.status(404).json({ message: 'No user found with this id' });
                return;
            }
            response.json(userData);
        })
        .catch(err => {
            console.log(err);
            response.status(500).json(err);
        });
});

module.exports = router;