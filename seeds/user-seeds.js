const { User } = require('../models');

const userData = [{
        username: 'test name',
        password: 'test password'

    },
];

const seedUsers = () => User.bulkCreate(userData);

module.exports = seedUsers;