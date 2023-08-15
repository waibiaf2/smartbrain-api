const handleSignIn = (db,bcrypt) => (req, res) => {
    console.log(req.body);
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json('Incorrect form submission');
    }

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
        }).catch(err => res.status(400).json('Wrong credentialsxxxx'));
}

module.exports = {
    handleSignIn,
}