const mongoose = require('mongoose');
require('dotenv').config({ path: 'letiables.env' })
//Define a schema
const Schema = mongoose.Schema;



const FileModelSchema = new Schema({
    filename: String,
    mimetype: String,
    path : String,
});

let CategoriesModelSchema  = new Schema({
    name: String
});



const ProductReviewModelSchema = new Schema({
    review: String,
    created_at: { type: Date, required: true, default: Date.now },
    user: { type: Schema.Types.ObjectId, ref: 'UserModel' },
});

const ProductModelSchema = new Schema({
    name: String,
    price: Number,
    quantity: Number,
    description: String,
    categories: [{ type: Schema.Types.ObjectId, ref: 'CategoriesModel' }],
    images: [FileModelSchema],
    reviews: [ProductReviewModelSchema]
});

const OrderModelSchema = new Schema({
    products: [ProductModelSchema],
    totalPrice: Number,
    user: { type: Schema.Types.ObjectId, ref: 'UserModel' },
    created_at: { type: Date, required: true, default: Date.now },
});

const UserModelSchema = new Schema({
    email: String,
    password: String,
    role: {
        type: String,
        enum: ['user', 'admin']
      },
});

const CategoriesModel = mongoose.model('CategoriesModel', CategoriesModelSchema);
const ProductReviewModel = mongoose.model('ProductReviewModel', ProductReviewModelSchema )
const ProductModel = mongoose.model('ProductModel', ProductModelSchema);
const FileModel = mongoose.model('FileModel', FileModelSchema);
const UserModel = mongoose.model('UserModel', UserModelSchema);
const OrderModel = mongoose.model('OrderModel', OrderModelSchema);


const mongoDB = process.env.MONGO_DB_URL;
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
module.exports = {
    ProductModel,
    UserModel,
    FileModel,
    OrderModel,
    CategoriesModel,
    ProductReviewModel,
};