const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors')

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());


const database = {
	users: [
		{
			id: 1,
			name: 'John',
			email: 'john@gmail.com',
			password: 'cookies',
			entries: 0,
			joined: new Date()
		},
		{
			id: 2,
			name: 'Sally',
			email: 'sally@gmail.com',
			password: '123',
			entries: 0,
			joined: new Date()
		},
	],
	login: [
		{
			id: '987',
			hash: '',
			email: 'john@gmail.com'
		}
	]
}

/*Home Route*/
app.get('/', (req, res) => {
	res.send('This is working!');
});

/*Users*/
app.get('/users', (req,res) =>{
	res.status(200).json(database.users);
})

app.get('/profile/:id', (req,res) =>{
	const {id} = req.params;
	let found = false;
	database.users.forEach(user => {
		if (user.id === Number(id)) {
			found = true;
			return res.json(user);
		}
	});
	
	if (!found) {
		return res.status(404).json('No Such user on the system');
	}
});

/*Sign In Routes
* **********************************************/
app.post('/signin', (req, res) => {
	// console.log(req.body);
	const {email, password} = req.body;
	
	if (email === database.users[1].email && password === database.users[1].password) {
		res.status(200).json('success');
	} else {
		res.status(400).json('error logging in')
	}
	
	/*database.users.forEach( user => {
		if (email === user.email && password === user.password) {
			res.json('success');
		}
	});
	
	res.status(400).json('error logging in');*/
});

/*Register
*************************************/
app.post('/register', (req, res) => {
	const {name, email, password} = req.body;
	const id = database.users.length + 1;
	
	database.users.push({
		id: id,
		name: name,
		email: email,
		password: password,
		entries: 0,
		joined: new Date()
	});
	res.status(201).json('success');
});

app.post('/image/:id', (req,res)=>{
	const {id} = req.params;
	let found = false;
	database.users.forEach(user => {
		if (user.id === Number(id)) {
			found = true;
			user.entries++;
			return res.json(user.entries);
		}
	});
	
	if (!found) {
		return res.status(400).json('Not Found');
	}
})

/*Server Listening Function*/
app.listen(3001,() => {
	console.log(`App is running on port 3001`);
});

/**
* / --> res = this is working
* /signin --> Post = success/fail
* /register --> POST = user
* /profile/:userId --> GET = user
* /image --> PUT --> user
* */
