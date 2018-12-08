const { ApolloServer, gql } = require('apollo-server')
const mongoose = require('mongoose')

mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true })
  .then(() => console.log('database connected'))
  .catch(err => console.log(`error : ${err}`))
const typeDefs = gql`
  type Todo {
    task : String
    completed : Boolean
  }
  type Query {
    getTodos: [Todo]
  }
`

const server = new ApolloServer({ typeDefs })

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})
