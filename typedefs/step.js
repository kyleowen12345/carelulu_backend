const { gql } = require('apollo-server-express');

module.exports =  gql`
scalar DateTime
  type Step {
   id: Int!
   content: String!
   complete: Boolean!
   user: User!
   task: Task!
   createdAt: DateTime! # will be generated
   updatedAt: DateTime! # will be generated
  }
  
  extend type Query {
    ViewStep(id:Int!):Step!
    MySteps(taskId:Int!,curPage:Int!,perPage:Int!,fieldOrder:String!,sort:String!): PaginatedSteps
  }

  extend type Mutation {

    createStep (
      content: String!
      complete: Boolean!
      taskId:Int!
    ): Step!

    updateStep (
      id:Int!
      content:String!
      complete:Boolean!
      taskId:Int!
    ): Step!

    deleteStep (
      id:Int!
      taskId:Int!
    ): DeleteResponse!

    }

    type DeleteResponse {
      success:Boolean!
      message:String!
    }

    type PaginatedSteps{
      steps:[Step!]
      curPage:String
      maxPage:Int
      stepCount:Int
    }

 
  `