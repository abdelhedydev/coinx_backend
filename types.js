const { gql, ApolloServer, Upload  } = require('apollo-server');
const { GraphQlDateTime } = require('graphql-iso-date');


const typeDefs = gql`

    scalar GraphQlDateTime
    
    type File {
    filename: String
    mimetype: String
    encoding: String
    path: String
    }

    type Categorie {
        id: ID!
        name: String
    }

    type Review {
        id: ID!
        review: String!
        created_at: GraphQlDateTime
        user: ID!
    }

    type Product {
        id: ID!
        name: String
        price: Float
        quantity: Int
        description: String
        images: [File]
        categories: [Categorie]
        reviews: [Review]
    }

    type Order {
        id: ID!
        products: [Product]
        totalPrice: Float
        user: ID!
        created_at: GraphQlDateTime
    }
    type User {
        id: ID!
        email: String!
        password: String!
    }

    input UserInput {
        email: String!
        password: String!
    }

    type LoggedInUser {
        user: User!
        token: String!
    }

    input ProductReviewInput {
        review: String!
        user: ID!
        product: ID!
    }

    input ProductInput {
        name: String!
        price: Float!
        quantity: Int!
        description: String!
        images: [Upload!]
        categories: [ID!]
    }

    input OrderProductInput {
        id: ID
        name: String!
        price: Float!
        totalPrice: Float!
        quantity: Int!
        description: String!
        images: [Upload!]
        categories: [ID!]
    }

    input OrderInput {
        products: [OrderProductInput]
        totalPrice: Float
        user: ID!
    }

    input CategorieInput {
        name: String!
    }
    input AddToBasketInput {
        itemNumber: Int!
        productId: ID!
    }

    type Query {
        products: [Product]
        productsByCategory(categoryId: ID!): [Product]
        product(productId: ID!): Product
        Categories: [Categorie]
        Categorie(categorieId: ID!): Categorie
        orderHistory(user: ID!): [Order]
        uploads: [File]
    }

    type Mutation {
        add(input: AddToBasketInput): Product
        addProduct(input: ProductInput):Product
        delete(input: ID!): Product
        update(productId: ID!,product: ProductInput):Product
        addReview(input: ProductReviewInput): Product
        addCategorie(input: CategorieInput):Categorie
        validateOrder(input: OrderInput): Order
        register(input: UserInput):LoggedInUser
        login(input: UserInput):LoggedInUser
        singleUpload(file: Upload!): File
    }
`;

module.exports = typeDefs;