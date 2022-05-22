const { gql } = require('apollo-server-express');

module.exports =  gql`
scalar DateTime
  type Task {
   id: Int!
   title: String!
   note: String!
   status: String!
   user: User!
   steps: [Step!]
   createdAt: DateTime! # will be generated
   updatedAt: DateTime! # will be generated
  }
  
  extend type Query {
    Viewtask(id:Int!):Task!
    Mytasks(curPage:Int!,perPage:Int!,fieldOrder:String!,sort:String!): [Task]
    filterTasks(completed:Boolean!,createdDate:String!): [Task]
  }

  extend type Mutation {
    createTask (
      title: String!
      note: String!
      status: String!
    ): Task
    }
  `