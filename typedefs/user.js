const { gql } = require('apollo-server-express');

module.exports =  gql`
scalar DateTime
  type User {
   id: Int!
   firstName: String!
   lastName: String
   email: String!
   tasks:[Task!]
   createdAt: DateTime! # will be generated
   updatedAt: DateTime! # will be generated
  }
  
  extend type Query {
    allUsers: [User]
    fetchUser: User
  }
  
  extend type Mutation {

    register(
      firstName: String!,
      lastName:String!,
      email: String!,
      password: String!
      ): RegisterResponse!

    login(
      email: String!,
      password: String!
      ): Token!
   }

    type RegisterResponse {
      user:User!
      token:String!
    }
    input RegisterInput {
      firstName: String!
      lastName:String!
      email: String!
      password: String!
      
    }
    type Token {
      token:String!
    }
    
`