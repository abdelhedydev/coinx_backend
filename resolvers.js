const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Promise = require('promise')
const fs = require('fs')
const shortid = require('shortid')

const { GraphQlDateTime } = require('graphql-iso-date')
const { ProductModel,
  UserModel,
  FileModel,
  OrderModel,
  CategoriesModel,
  ProductReviewModel } = require('./database')
const SECRET_APP = 'secret token'

const UPLOAD_DIR = '../react-training/public/images'
const IMAGES_DIR = '/images'

const storeFS = ({ stream, filename }) => {
  const id = shortid.generate()
  const persistingPath = `${UPLOAD_DIR}/${id}-${filename}`
  const path = `${IMAGES_DIR}/${id}-${filename}`
  return new Promise((resolve, reject) =>
    stream
      .on('error', error => {
        if (stream.truncated) { fs.unlinkSync(persistingPath) }
        reject(error)
      })
      .pipe(fs.createWriteStream(persistingPath))
      .on('error', error => reject(error))
      .on('finish', () => resolve({ id, path }))
  )
}

const resolvers = {
  GraphQlDateTime: {
    GraphQlDateTime
  },
  Query: {
    products: async (_, args) => {
      try {
        let products = await ProductModel.find()
        return products
      } catch (err) {
        console.log(err)
      }
    },
    productsByCategory: async (_, { categoryId }) => {
      try {
        const products = await ProductModel.find({ 'categories': { _id: `${categoryId}` } })
        return products
      } catch (err) {
        console.log(err)
      }
    },
    product: async (_, args) => {
      let product = await ProductModel.findById(args.productId)
      return product
    },
    Categories: async (_, args) => {
      try {
        let categories = await CategoriesModel.find()
        return categories
      } catch (err) {
        console.log(err)
      }
    },
    orderHistory: async (_, { user }) => {
      try {
        const orders = await OrderModel.find({ 'user': { _id: `${user}` } })
        return orders
      } catch (err) {
        console.log(err)
      };
    }
  },
  Mutation: {
    add: async (_, { input }) => {
      let result = await ProductModel.findByIdAndUpdate(input.productId, { $inc: { quantity: input.itemNumber } })
      return result
    },
    addProduct: async (_, { input }) => {
      try {
        let imagesPromise = input.images.map(async (element) => {
          const { stream, filename } = await element
          const { path } = await storeFS({ stream, filename })
          const image = new FileModel({
            filename,
            path
          })
          return image
        })
        let images = await Promise.all(imagesPromise)
        let newProduct = new ProductModel(input)
        newProduct.images = images
        let result = await newProduct.save()
        return result
      } catch (err) {
        console.log(err)
      }
    },
    delete: async (_, { input }) => {
      let result = await ProductModel.findByIdAndDelete(input)
      return result
    },
    update: async (_, { productId, product }) => {
      try {
        const result = await ProductModel.findByIdAndUpdate(productId, product)
        return result
      } catch (err) {
        console.log(err)
      }
    },
    validateOrder: async (_, { input }) => {
      const order = new OrderModel(input)
      const result = await order.save()
      return result
    },
    addReview: async (_, { input: { review, user, product } }) => {
      try {
        const newProduct = await ProductModel.findById(product)
        const newReview = new ProductReviewModel({ review, user })
        newProduct.reviews.push(newReview)
        const result = ProductModel.findByIdAndUpdate(product, newProduct)
        return result
      } catch (err) {
        console.log(err)
      }
    },
    addCategorie: async (_, { input }) => {
      try {
        let newCategorie = new CategoriesModel({ name: input.name })
        let result = await newCategorie.save()
        return result
      } catch (err) {
        console.log(err)
      }
    },
    register: async (_, { input }) => {
      console.log('ur input', input)
      const passwordHash = bcrypt.hashSync(input.password, 10)
      const user = new UserModel({ email: input.email, password: passwordHash })
      await user.save()
      const token = jwt.sign({ userid: user.id }, SECRET_APP, { expiresIn: '1h' })
      return {
        user,
        token
      }
    },
    login: async (_, { input }) => {
      const user = await UserModel.findOne({ email: input.email })
      if (!user) {
        throw new Error('wrong email')
      }
      if (!bcrypt.compareSync(input.password, user.password)) {
        throw new Error('Wrong password')
      }
      const token = jwt.sign({ userid: user.id }, SECRET_APP, { expiresIn: '1h' })
      return {
        user,
        token
      }
    }
  }
}

module.exports = resolvers
