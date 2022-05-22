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
    register(input: RegisterInput!): User
    login(email: String!,password: String!): Token!
   }

    type RegisterResponse {
      id: Int!
      firstName: String!
      lastName:String!
      email: String!
      tasks:[Task!]
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