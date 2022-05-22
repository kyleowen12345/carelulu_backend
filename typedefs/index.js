const {gql} = require('apollo-server-express');

const User = require('./user');
const Task = require('./task');
const Step = require('./step')

const linkSchema  =  gql`
scalar Date
type Query {
  _: Boolean
}
type Mutation {
  _: Boolean
}
type Subscription {
  _: Boolean
}
`;
module.exports =  [linkSchema , User, Task, Step]