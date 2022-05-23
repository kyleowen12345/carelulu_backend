'use strict';
const {
  ApolloError,
  AuthenticationError
} = require('apollo-server-express');
require('dotenv').config()


module.exports = {
    Query: {
        async Viewtask(_, {id }, {authUser,models:{taskModel}}) {

          if(!authUser) throw new AuthenticationError('You Must Login First')

          try {
            return await taskModel.findOne({where: { id: id }});
          } catch (error) {
            throw new ApolloError(error)
          }
            
         },
         async Mytasks(_, {fieldOrder,sort,curPage=1,perPage=5 }, {authUser,models:{taskModel}} ) {
          
          if(!authUser) throw new AuthenticationError('You Must Login First')

          try {

             const {count, rows}= await taskModel.findAndCountAll({
              where:{
                userId:authUser.id
              
              },
              order:[[fieldOrder,sort]],
              limit:perPage,
              offset:(curPage-1) * perPage
            });

            return {
              tasks:rows,
              curPage:curPage,
              maxPage:Math.ceil(count / perPage),
              taskCount:count
            }

           } catch (error) {

            throw new ApolloError(error)

           }
           
         },
    },
    Mutation: {
      async createTask(_, { title,note,status }, { authUser,models:{taskModel} }) {

        if(!authUser) throw new AuthenticationError('You Must Login First')
        

      try {

        const task = await taskModel.create({
          title,
          note,
          status,
          userId:authUser.id
        });
       
        return task;

      } catch (error) {

        throw new ApolloError(error)

      } 
        
    },
    async updateTask(_, {id, title,note,status }, { authUser,models:{taskModel} }) {

      if(!authUser) throw new AuthenticationError('You Must Login First')
      
      try {
        const task = await taskModel.findByPk(id)

        if(!task) return new ApolloError('No task with this id')

        await task.update({
          title,
          note,
          status,
        });

        return task;

      } catch (error) {

        throw new ApolloError(error)

      }
     
  },
      async deleteTask(_, {id}, { authUser,models:{taskModel,stepModel} }) {

        if(!authUser) throw new AuthenticationError('You Must Login First')

        try {

          await stepModel.destroy({where:{taskId:id}})

          const task = await taskModel.findOne({where:{id:id,userId:authUser.id}})

          if(!task) return new ApolloError('No task with this id')

          await task.destroy()
           
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
    Task:{
      user: async ({ userId }, args, {models:{userModel}}, info) => {
      
          try {
            const user = await userModel.findOne({where:{id:userId}});
           
            return user;
            
          } catch (error) {
            throw new ApolloError(error)
          }
          
        },
      steps: async ({ id }, args, {authUser,models:{stepModel}}, info) => {

        if(!authUser) throw new AuthenticationError('You Must Login First')

         try {
          const steps = await stepModel.findAll({
            where: {
              userId: authUser.id,
              taskId: id
            },limit:10  });

          return steps;

         } catch (error) {

           throw new ApolloError(error)

         }
          
        },  
  }
}