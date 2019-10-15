const mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'bhanu',
    password : 'pratap1277',
    database : 'umi_database'
});
 
function connectDB(){
    connection.connect();
}

function signup( first_name, last_name, email, hash, birthday, gender, cb){
    connection.query('insert into signup_table (first_name,last_name,email,password,birthday,gender) values (?,?,?,?,?,?) ', [first_name, last_name, email, hash, birthday, gender], function(err,results){
        if(err)
            throw err;
        cb(results);
    })
}

function getUser(email, cb) {
    connection.query(`Select * from users where email = ?`, [email], function(err, results) {
        if(err) throw err;
        cb(results);
    })

}

module.exports = {
    connectDB,
    signup,
    getUser
}