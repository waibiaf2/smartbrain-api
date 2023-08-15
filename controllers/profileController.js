const handleProfileGet = (req,res,db) =>{
    const {id} = req.params;

    db.select('*').from('users').where({id})
        .then(user => {
            if (user.length) {
                return res.status(200).json(user);
            }
            res.status(400).json('Not Found');
        })
        .catch(err => res.status(400).json('Error getting user'))
}

module.exports = {
    handleProfileGet,
}