'use strict';
const {
  ApolloError
} = require('apollo-server-express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Task,User } = require('../models/index');
require('dotenv').config()


module.exports = {
    Query: {
        async Viewtask(_, {id }, {authUser}) {
          try {
            return await Task.findOne({where: { id: id }});
          } catch (error) {
            throw new ApolloError(err)
          }
            
         },
         async Mytasks(_, {fieldOrder,sort,curPage=1,perPage=5 }, {authUser,models:{taskModel}} ) {
           try {
            return await taskModel.findAll({
              where:{
                userId:authUser.id,
                // status:status ? status : "In Progress" 
              },
              order:[[fieldOrder,sort]],
              limit:perPage,
              offset:(curPage-1) * perPage
            });
           } catch (error) {
            throw new ApolloError(error)
           }
           
         },
    },
    Mutation: {
      async createTask(_, { title,note,status }, { authUser }) {
    
        await User.findOne({ where: { id: authUser.id } });
        console.log(authUser.id)
        const task = await Task.create({
          title,
          note,
          status,
          userId:authUser.id
        });
        console.log(task);
        return task;
    },
        
    },
    Task:{
      user: async ({ id }, args, {models:{userModel}}, info) => {
          console.log(`${id} userId`)
          const user = await userModel.findOne({id: id});
          return user;
        },
  }
}