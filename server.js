const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');
const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');

let app = express();
const url = 'mongodb://localhost:27017/edx-course-db';
mongoose.connect(url);

const Account = mongoose.model('Account', {
    name: String,
    balance: Number
});

app.use(bodyParser.json());
app.use(logger('dev'));
app.use(errorHandler());

app.get('/accounts', (req, res) => {
    Account.find((error, accounts) => {
        if(error) {
            res.status(400).send(error);
        } else {
            res.status(200).send(accounts);
        }
    });
});

app.post('/accounts', (req, res) => {
    let account = new Account({
        name: req.body.name,
        balance: req.body.balance
    });
    account.save((error) => {
        if (error) {
            res.status(400).send(error);
        } else {
            res.status(201).send({id: account._id});
        }
    });
});

app.put('/accounts/:id', (req, res) => {
    Account.findById(req.params.id, (error, account) => {
        if(error) {
            res.status(404).send(error);
        } else if (account) {
            if(req.body.name) account.name = req.body.name;
            if(req.body.balance) account.balance = req.body.balance;
            account.save((error) => {
                if(error) {
                    res.status(400).send(error);
                } else {
                    res.status(200).send(account);
                }
            });
        } else {
            res.status(404).send('Account not found');
        }
    });
});

app.delete('/accounts/:id', (req, res) => {
    Account.findById(req.params.id, (error, account) => {
        if(error) {
            res.status(404).send(error);
        } else if (account) {
            account.remove((error) => {
                if(error) {
                    res.status(400).send(error);
                } else {
                    res.sendStatus(200);
                }
            });
        } else {
            res.status(404).send('Account not found');
        }
    });
});

app.listen(3000);
