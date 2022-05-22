const { gql } = require('apollo-server-express');

module.exports =  gql`
scalar DateTime
  type Step {
   id: Int!
   content: String!
   complete: Boolean!
   userId: User!
   taskId: Task
   createdAt: DateTime! # will be generated
   updatedAt: DateTime! # will be generated
  }
  
 
  `