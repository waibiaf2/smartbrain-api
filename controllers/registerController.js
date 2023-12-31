const handleRegister = function(req,res,db,bcrypt) {
    (req, res) => {
        const {name, email, password} = req.body;

        if (!email || !name || !password) {
            return res.status(400).json('Incorrect form submission');
        }

        var hash = bcrypt.hashSync(password);

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

    }
}

module.exports ={
    handleRegister,
}