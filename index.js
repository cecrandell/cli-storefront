let mysql = require("mysql");
let inquirer = require("inquirer");

let connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "storefront"
  });

  connection.connect(function (err) {
    if (err) throw err;
    readProducts();
  });

  function readProducts() {
    console.log("Items Available for Sale:\n");
    connection.query("SELECT * FROM products", function (err, res) {
      if (err) throw err;
      for (let i = 0; i < res.length; i++) {
        console.log("Product Name: " + res[i].product_name);
        console.log("Item ID: " + res[i].item_id);
        console.log("Stock Quantity: " + res[i].stock_quantity);
        console.log("Price: $" + res[i].price);
        console.log("\n-----------------------------------------\n");
      }
      whichProduct();
    });
  }

  function whichProduct() {
    inquirer
      .prompt([
        {
          name: "desired_ID",
          type: "number",
          message: "What is the ID of the product you would like to buy?",
          validate: function (value) {
            if (isNaN(value) === false) {
              return true;
            }
          }
        }
      ])
      .then(function (answer) {
        connection.query("SELECT * FROM products", function (err, results) {
          if (err) throw err;
          let last = JSON.stringify(results[results.length - 1].item_id);
          let newArr = [];
          for (let i = 1; i <= last; i++) {
            newArr.push(i);
          }
          if (newArr.includes(answer.desired_ID)) {
            howMany(answer.desired_ID);
          } else {
            console.log("Please choose a valid product ID between 1 and " + last);
            whichProduct();
          }
        })
      })
  }

  function howMany(productNum) {
    inquirer
      .prompt([
        {
          name: "desired_quantity",
          type: "number",
          message: "How many would you like to buy?",
          validate: function (value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        }
      ])
      .then(function (answer) {
        connection.query("SELECT * FROM products", function (err, results) {
          if (err) throw err;
          if (results[productNum - 1].stock_quantity <= 0) {
            console.log("This item is out of stock! Please choose another item.");
            whichProduct();
          } else if (results[productNum - 1].stock_quantity < answer.desired_quantity) {
            console.log("Insufficient quantity! The current quantity of stock for this item is " + results[productNum - 1].stock_quantity + ". Please choose another amount.");
            howMany(productNum);
          } else {
            let newStock = results[productNum - 1].stock_quantity - answer.desired_quantity;
            let totalPrice = results[productNum - 1].price * answer.desired_quantity;
            connection.query(
              "UPDATE products SET stock_quantity = ? WHERE item_id = ?",
              [newStock, productNum],
              function (err) {
                if (err) throw err;
              }
            );
            connection.end();
            console.log("You have now placed an order for " + answer.desired_quantity + " of the book " + results[productNum - 1].product_name + "!");
            console.log("This product costs $" + results[productNum - 1].price + " per unit, so your grand total came to $" + totalPrice.toFixed(2) + ".");
          }
        })
      })
  }
  