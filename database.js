const mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  user: "bhanu",
  password: "pratap1277",
  database: "umi_database"
});

function connectDB() {
  connection.connect();
  console.log("database.js, database connected");
}

function signup(first_name, last_name, email, hash, birthday, ph_number, cb) {
  console.log(ph_number);
  connection.query(
    "Insert into users_table (first_name,last_name,email,password,birthday,ph_number) values (?,?,?,?,?,?) ",
    [first_name, last_name, email, hash, birthday, ph_number],
    function(err, results) {
      if (err) throw err;
      cb(results);
    }
  );
}

function getUser(email, cb) {
  connection.query(
    `Select * from users_table where email = ?`,
    [email],
    function(err, results) {
      if (err) throw err;
      console.log(results);
      console.log("getUser");
      cb(results);
    }
  );
}

module.exports = {
  connectDB,
  signup,
  getUser
};
