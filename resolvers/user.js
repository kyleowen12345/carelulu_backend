'use strict';
const {
  ApolloError,
  AuthenticationError 
} = require('apollo-server-express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config()


module.exports = {
    Query: {
        async allUsers(_,args,{authUser,models:{userModel}}) {

            if(!authUser) throw new AuthenticationError('You Must Login First')

            try {

                return await userModel.findAll({});

            } catch (error) {

                throw new ApolloError(error)

            }
           
         },
         async fetchUser(_, args, {authUser,models:{userModel}} ) {

            if(!authUser) throw new AuthenticationError('You Must Login First')

            try {

                return await userModel.findOne({where:{id:authUser.id}});

            } catch (error) {

                throw new ApolloError(error)

            }
            
         },
    },
    Mutation: {
         async login(_ , {email, password},{models:{userModel}}){
            
            try {

                const user = await userModel.findOne({ where: {email}});

             if(!user) throw new AuthenticationError('User does not exist.')

             const valid = await bcrypt.compare(password, user.password);

             if(!valid) throw new AuthenticationError('Your email or password is incorrect.')

             const token = jwt.sign({
                id: user.id,
                email: user.email 
            }, process.env.JWT_SECRET, {expiresIn: '24h'})

             return {token} 

            } catch (error) {
                
                throw new ApolloError(error)

            }
            
         },
        
        async register(root, {firstName,lastName,email, password},{models:{userModel}}) {
   
             
          try {

            const existingEmail = await userModel.findOne({ where: {email}});

            if(existingEmail) return new AuthenticationError('email already exists')

            const user = await userModel.create({ 
                firstName,
                lastName,
                email,
                password:await bcrypt.hash(password, 10) });
            
            const token = jwt.sign({
                id: user.id,
                email: user.email 
            }, process.env.JWT_SECRET, {expiresIn: '24h'})

            const response = {
                user,
                token
            }    
              return response
              
          } catch (error) {

             throw new ApolloError(error)
              
          }
         
        },

          
    },
    User:{
        tasks: async ({ id }, args, {models:{taskModel}}, info) => {
            try {

                const tasks = await taskModel.findAll({where: {userId: id},limit:5  });
                return tasks;

            } catch (error) {

                throw new ApolloError(error)

            }
            
          },
    }
}