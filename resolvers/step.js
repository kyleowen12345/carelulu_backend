'use strict';
const {
  ApolloError,
  AuthenticationError
} = require('apollo-server-express');
require('dotenv').config()


module.exports = {
    Query: {
        async ViewStep(_, {id }, {authUser,models:{stepModel}}) {

          if(!authUser) throw new AuthenticationError('You Must Login First')

          try {

            return await stepModel.findOne({where: { id: id }});

          } catch (error) {

            throw new ApolloError(err)

          }
            
         },
         async MySteps(_, {taskId,fieldOrder,sort,curPage=1,perPage=5 }, {authUser,models:{stepModel}} ) {
         
          if(!authUser) throw new AuthenticationError('You Must Login First')
          
          try {

             const {count, rows}= await stepModel.findAndCountAll({
              where:{
                userId:authUser.id,
                taskId:taskId
            
              },
              order:[[fieldOrder,sort]],
              limit:perPage,
              offset:(curPage-1) * perPage
            });

            return {
              steps:rows,
              curPage:curPage,
              maxPage:Math.ceil(count / perPage),
              stepCount:count
            }

           } catch (error) {

            throw new ApolloError(error)

           }
           
         },
    },
    Mutation: {
      async createStep(_, { content,complete,taskId }, { authUser,models:{stepModel} }) {

        if(!authUser) throw new AuthenticationError('You Must Login First')
    
      try {

        const step = await stepModel.create({
          content,
          complete,
          taskId,
          userId:authUser.id
        });
        
      
        return step;

      } catch (error) {

        throw new ApolloError(error)
        
      } 
        
    },
    async updateStep(_, {id, content,complete,taskId }, { authUser,models:{stepModel} }) {
      
      if(!authUser) throw new AuthenticationError('You Must Login First') 
      
      try {
        const step = await stepModel.findOne({
            where:{
                id:id,
                taskId:taskId,
                userId:authUser.id
            }})

        if(!step) return new ApolloError('No task with this id')

        await step.update({
            content,
            complete,
        });

        return step;

      } catch (error) {

        throw new ApolloError(error)

      }
     
  },
      async deleteStep(_, {id,taskId}, { authUser,models:{stepModel} }) {

        if(!authUser) throw new AuthenticationError('You Must Login First')

        try {
          const step = await stepModel.findOne({
              where:{
                id:id,
                userId:authUser.id,
                taskId:taskId
            }})

          if(!step) return new ApolloError('No task with this id')

          await step.destroy()
           
          const response = {
            success:true,
            message:'Delete successful'
          }

          return response;
        } catch (error) {
          throw new ApolloError(error)
        }
      
    },
        
    },
    Step:{
      user: async ({ userId,id }, args, {models:{userModel}}, info) => {

          try {
            
            const user = await userModel.findOne({where:{id:userId}});
            
            return user;

          } catch (error) {
            
            throw new ApolloError(error)

          }
         
        },
     task: async ({ taskId }, args, {models:{taskModel}}, info) => {
       
        try {
          
          const user = await taskModel.findOne({where:{id: taskId}});
          return user;

        } catch (error) {
           
          throw new ApolloError(error)

        }
       
        },  
  }
}