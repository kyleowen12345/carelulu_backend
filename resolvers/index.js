// const {GraphQLDateTime} = require('graphql-iso-date');
const userResolver = require('./user');
const taskResolver = require('./task');




module.exports = [ userResolver,taskResolver  ]