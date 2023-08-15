const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors')
const knex = require('knex');

/*Controllers*/
const {handleRegister} = require('./controllers/registerController');
const {handleSignIn} = require('./controllers/signinController')
const {handleProfileGet} = require('./controllers/profileController')
const {
	handleImage,
	handleApiCall} 	= require("./controllers/imageController");

console.log(process.env.DATABASE_PASSWORD);
/*Initializing Knex instance*/
const db = knex({
	client: 'pg',
	connection: {
		host: process.env.DATABASE_HOST,
		port: process.env.DATABASE_PORT,
		user: process.env.DATABASE_USER,
		password: process.env.DATABASE_PASSWORD,
		database: process.env.DATABASE_NAME,
	}
});

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


/*Home Route*/
app.get('/', (req, res) => {
	res.send('This is working! ');
});


app.get('/users', (req,res) =>{
	db.select('*').from('users')
		.then(users => res.json(users));
})

app.get('/profile/:id', (req,res) => handleProfileGet(req,res,db));

app.post('/signin', (req,res) => handleSignIn(db,bcrypt)(req,res));

app.post('/register' , (req,res) => handleRegister(req,res,db, bcrypt));

app.put('/image', (req,res) => handleImage(req,res,db));

app.put('/image/remote', (req,res) => handleApiCall(req,res,db));

app.listen(process.env.PORT,() => {
	console.log(`App is running on port ${process.env.PORT}...`);
});

