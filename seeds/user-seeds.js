const { User } = require('../models');

const userData = [
    {
        username:'ip1',
        password:'test1'
    },
    {
        username:'ip2',
        password:'test2'
    },
    {
        username:'ip3',
        password:'test3'
    }
    ]

const seedUsers = () => User.bulkCreate(userData);
module.exports = seedUsers;