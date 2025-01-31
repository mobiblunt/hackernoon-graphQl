const { ApolloServer } = require('apollo-server');
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client')
const { getUserId } = require('./utils');
const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const User = require('./resolvers/User')
const Link = require('./resolvers/Link')
const { PubSub } = require('apollo-server')
const Subscription = require('./resolvers/Subscription')
const Vote = require('./resolvers/Vote')
// 1

const prisma = new PrismaClient()

const pubsub = new PubSub()


  

// 2
const resolvers = {
  Query,
  Mutation,
  Subscription,
  Vote,
  User,
  Link
}

// 3
const server = new ApolloServer({
    typeDefs: fs.readFileSync(
        path.join(__dirname, 'schema.graphql'),
        'utf8'
      ),
  resolvers,
  context:  ({ req }) => {
    return {
    prisma,
    pubsub,
    userId:
        req && req.headers.authorization
          ? getUserId(req)
          : null
    };
  }
})

server
  .listen()
  .then(({ url }) =>
    console.log(`Server is running on ${url}`)
  );