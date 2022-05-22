'use strict';
const {
  ApolloError,
  AuthenticationError 
} = require('apollo-server-express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User,Task,Step} = require('../models/index');
require('dotenv').config()


module.exports = {
    Query: {
        async allUsers() {
            return await User.findAll({},{include:[Step,Task]});
         },
         async fetchUser(_, args, {authUser} ) {
            return await User.findOne({id:authUser.id});
         },
    },
    Mutation: {
         async login(_ , {email, password}){
            
             const user = await User.findOne({ where: {email}});
             if(!user){
                 throw new AuthenticationError('No user Found with this email')
             }
             const valid = await bcrypt.compare(password, user.password);
             if(!valid){
                throw new AuthenticationError('invalid password')
             }
             const token = jwt.sign({
                id: user.id,
                email: user.email 
            }, process.env.JWT_SECRET, {expiresIn: '24h'})
             return {token}
         },
        
        async register(root, {input}, context) {
          const {firstName,lastName,email, password} = input
          console.log(input)
          const user = await User.create({ 
            firstName,
            lastName,
            email,
            password:await bcrypt.hash(password, 10) },{
                include:[
                    {
                        model:Task, as:'tasks'
                    }
                ]
            });
            console.log(user)
          return user
        },

        // async updateUser(_, {id, firstName, lastName}, {authUser}){
        //     if(!authUser){
        //       throw new AuthenticationError('You Must Login First')
        //     }
        //     try {
        //     const user = await User.findById(id);
        //     if(!user){
        //         throw new Error('No User foudn for update, please check userid')
        //       }
        //     await user.update({
        //         firstName,
        //         lastName
        //     });
        //     return user;
        //     }catch(err){
        //       throw new ApolloError(err)
        //     }
        //   }    
    },
    User:{
        tasks: async ({ id }, args, {models:{taskModel}}, info) => {
            console.log(id)
            const tasks = await taskModel.findAll({where: {userId: id},limit:5  });
            return tasks;
          },
    }
}