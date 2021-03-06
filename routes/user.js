const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

router.post('/signup', (req, res, next) => {
    User.find({ email: req.body.email })
    .exec()
    .then( user => {
        if (user.length >= 1){
            return res.status(409).json({
                message: 'Mail Exists'
            });
        } else{
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err){
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                        });
                        user
                        .save()
                        .then( result => {
                            res.status(200).json({
                                _id: result._id,
                                email: result.email,
                                password: result.password,
                                message: 'User Created'

                            });
                        })
                        .catch( err => {
                            res.status(500).json({
                                error: err
                            });
                        });
                }
            
            });
        }
    });
    
});

router.get("/", (req, res, next) =>{
 User.find()
 .select('email password _id')
 .exec()
 .then( docs => {
     res.status(200).json({
         count: docs.length,
         user: docs.map(doc =>{
             return{
                 id: doc._id,
                 email: doc.email,
                 password: doc.password,
                 request:{
                    type: "GET",
                    url: "http://localhost:3000/user/" + doc._id
                }
             };
         })
     });
 })
 .catch(err =>{
     console.log(err);
     res.status(500).json({
         error: err
     });
 });

});
router.post('/login', (req, res, next) => {
    User.find({ email: req.body.email})
    .exec()
    .then( user => {
        if (user.length < 1){
            return res.status(401).json({
                message: 'Mail not found, user doesn\'t exist'
            });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if(err) {
                return res.status(401).json({
                    message: 'Auth Failed'
                });
            }
            //tOKEN CONVERSION FOR LOGIN
            if(result){
                const token = jwt.sign(
                {
                    email: user[0].email,
                    userId: user[0]._id
                }, 
                'SECRET',
                {
                    expiresIn: '1h'
                });
                return res.status(200).json({
                    message: 'Auth Successful',
                    token: token
                });
            }
            res.status(401).json({
                message: 'Auth Failed'
            });
        });
    })
    .catch( err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.delete('/:userId', (req, res ,next) =>{
    User.remove({
        _id: req.params.userId
    })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'user Deleted',
            
        });

    })
    .catch( result => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });

});

module.exports = router;