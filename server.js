const cors= require('cors');
const express= require('express');
const jwt = require('jsonwebtoken');
const helmet = require('helmet')
const { createServer } = require("http");
const { ApolloServer, AuthenticationError } = require('apollo-server-express');
const dotenv=require("dotenv")
const { makeExecutableSchema } = require('@graphql-tools/schema');
const {User,Task,Step}= require('./models/index')
const typeDefs = require('./typedefs');
const resolvers = require('./resolvers');




(async () =>{

	const port =process.env.PORT || 4000

	const app = express();

	const corsOptions = {
		origin: process.env.PUBLIC_URL,
		optionsSuccessStatus: 200, // For legacy browser support
		// method: "GET, POST, DELETE,",
	};
	
	
	app.use(express.json())
	app.use(cors(corsOptions));
	app.use(helmet({ contentSecurityPolicy: (process.env.NODE_ENV === 'production') ? undefined : false }))


	const getUser = async (req) => {
		const token = req.headers['x-token'];
		if(token){
		  try {
			return await jwt.verify(token, process.env.JWT_SECRET) 
		  }catch(e){
			 throw new AuthenticationError('Your session expired')
		  }
		}
	 }
	
    const server = new ApolloServer({
		introspection: true,
		typeDefs: typeDefs,
		resolvers,
		context: async ({req}) => {
			if(req){
				const authUser = await getUser(req);
				return {
					authUser,
					models:{
						userModel:User,
						taskModel:Task,
						stepModel:Step
					}
					
				  }
			}
		  
		//   console.log(`${authUser} line 50`);
		 
		},
		csrfPrevention: true,
	
	  });


	  await server.start();

      server.applyMiddleware({app, path: '/graphql'});


	  app.listen(port, () => {
		console.log(`Server will start at ${port}`)
		
	  });
})();






