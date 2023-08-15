const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors')
const knex = require('knex');

const db = knex({
	client: 'pg',
	connection: {
		host: '127.0.0.1',
		port:5432,
		user: 'waibi',
		password: 'andy',
		database: 'smart-brain'
	}
});

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

/*Home Route*/
app.get('/', (req, res) => {
	res.send('This is working!');
});

/*Users*/
app.get('/users', (req,res) =>{
	db.select('*').from('users')
		.then(users => res.json(users));
})

app.get('/profile/:id', (req,res) =>{
	const {id} = req.params;

	db.select('*').from('users').where({id})
		.then(user => {
			if (user.length) {
				return res.status(200).json(user);
			}
			res.status(400).json('Not Found');
		})
		.catch(err => res.status(400).json('Error getting user'))
});

/*Sign In Routes
* **********************************************/
app.post('/signin', (req, res) => {
	const {email, password} = req.body;

	db.select('email', 'hash')
		.from('login')
		.where('email', '=', req.body.email)
		.then(data => {
			// console.log(data[0])
			const isValid = bcrypt.compareSync(password, data[0].hash); // true
			if (isValid) {
				db.select('*')
					.from('users')
					.where('email', '=', email)
					.then(user => {
						res.json(user[0]);
					})
					.catch(err => res.status(400).json('Unable to get user'));
			} else {
				res.status(400).json('Wrong credentials!')
			}
		}).catch(err => res.status(400).json('Wrong credentials'));
});

/*Register
*************************************/
app.post('/register', (req, res) => {
	const {name, email, password} = req.body;

	var hash = bcrypt.hashSync(password);

	// bcrypt.compareSync("veggies", hash); // false

	db.transaction(trx => {
		trx.insert({
			hash: hash,
			email: email
		}).into('login')
			.returning('email')
			.then(loginEmail => {
				db('users')
					.returning('*')
					.insert({
						email: loginEmail[0].email,
						name: name,
						joined: new Date()
					})
					.then(user => {
						res.status(201).json(user[0])
					})
					.catch(err => res.status(400).json('unable to register or join...'));
			})
			.then(trx.commit)
			.catch(trx.rollback);
	})

});

app.put('/image', (req, res) => {
	const {id} = req.body;
	db('users')
		.where('id', '=', id)
		.increment('entries', 1)
		.returning('entries')
		.then(entries => {
			console.log(entries[0]);
			res.json(entries[0]);
		}).catch(err => res.status(400).json('Unable to get entries'));
});

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
