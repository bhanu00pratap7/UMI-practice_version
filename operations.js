const bcrypt = require('bcrypt');
const database = require('./database');

const saltRounds = 10;
function encrypt( first_name, last_name, email, password, birthday, gender, cb) {

    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {

            database.signup( first_name, last_name, email, hash, birthday, gender, function(data) {
                cb(data);

            })
        });
    });

}
function compare(password, hash, cb) {
    bcrypt.compare(password, hash, function(err, res) {
        cb(res);
    });

}

module.exports = {
    encrypt,
    compare
}