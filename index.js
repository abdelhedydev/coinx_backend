const { ApolloServer, gql } = require('apollo-server')
const mongoose = require('mongoose')
mongoose
  .connect('mongodb://coinx_user:coinx_user2018@ds229474.mlab.com:29474/coinx_db', { useNewUrlParser: true })
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
