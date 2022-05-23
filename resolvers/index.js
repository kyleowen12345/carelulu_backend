// const {GraphQLDateTime} = require('graphql-iso-date');
const userResolver = require('./user');
const taskResolver = require('./task');
const stepResolver = require('./step')



module.exports = [ userResolver,taskResolver,stepResolver  ]