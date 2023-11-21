const assert = require('assert');

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const mongoose = require('mongoose');
const itemSchema = require('./models/Items');

const mongourl = 'mongodb+srv://dev:dev@cluster0.q8fti4a.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp'; 
const dbName = '381project';
const dbCol = 'Items'

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.set('view engine', 'ejs');
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true}));

const handle_Find = function(res, criteria){
    mongoose.connect(mongourl);
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error'));
    db.once('open', async () => {
    	let Items = mongoose.model('Items', itemSchema);
    
    	try{
        	const searchResult = await Items.find(criteria).lean().exec();
        	console.log(searchResult);
    		return searchResult;
        }catch(err){
        	console.error(err);
        	console.log("Error occurred");
        }finally{
        	db.close();
        	console.log("Closed DB connection");
        }
    });
}

app.get('/home', function(req, res){
    console.log("...Welcome to the home page!");
    const allItems = handle_Find(res,{});
    var amount = allItems.length;
    var quantity = 0;
    for (var item in allItems){
    	quantity+=item.quantity;
    }
    return res.status(200).render("home", {quantity: quantity, amount: amount, foundItems: allItems});
});

app.listen(process.env.PORT || 8099);
