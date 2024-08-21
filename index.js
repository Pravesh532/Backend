// const { faker } = require('@faker-js/faker');
const mysql= require("mysql2");
const  express= require("express");
const app= express();
const path= require("path");
const methodOverride = require("method-override");
const { v4: uuidv4 } = require("uuid");


const method_override=require("method-override");
app.use(method_override("_method"));
app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs"); 
 app.set("views",path.join(__dirname, "/views"));
 
const connection  = mysql.createConnection({
    host:'localhost',
    user: 'root',
    database: 'deltaapp',  
    password:'pravesh@2002'
});
// let  getRandomUser=()=>  {
//     return [
//        faker.string.uuid(),
//        faker.internet.userName(),
//        faker.internet.email(),
//        faker.internet.password(),
    
//     ];
// }

// let q= "INSERT INTO USER (id,username,email,password) VALUES ?";
//         let data=[];
// for(let i=1;i<=100;i++){
//           data.push(getRandomUser());

//         };
        

// try{
//     connection.query(q,(err,result)=>{
//         if(err)throw(err);
//         console.log(result);
//      });

// } catch(err){
//     console.log(err);
// }

app.get("/",(req,res)=>{
    let q="SELECT COUNT(*) FROM USER"
    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            console.log(result);
            // let coun= result[0]["count(*)"];
            res.render("home.ejs",{ result});
         });
    
    } catch(err){
        // console.log(err);
        res.send(" somme  err occur in db ");
    }
   

});
app.get("/user", (req, res) => {
    let q = `SELECT * FROM USER`;
    try {
      connection.query(q, (err, users) => {
        if (err) {
          res.status(500).send("Error occurred while fetching users");
        } else {
            console.log(users.ID);
          res.render("show.ejs", { users });
          
        }
      });
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    }
  });
  app.get("/user/:id/edit",(req,res)=>{
    let{id}= req.params;
    let q= ` SELECT *FROM USER WHERE ID="${id}"`;
    try {
      connection.query(q, (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).send("Error occurred while fetching users");
        } else {
          let users= result[0];
          res.render("edit.ejs", { users });
          
        }
      });
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    }
  });
   app.patch("/user/:id",(req,res)=>{
    let{id}= req.params;
    let{ PASSWORD: formpass, USERNAME:NEWusername}= req.body;
    let q= ` SELECT *FROM USER WHERE ID="${id}"`;
    try {
      connection.query(q, (err, result) => {
        if (err) {
          
          
          res.status(500).send("Error occurred while fetching users");
        } else {
          
          let users = result[0];
          if(formpass!=users.PASSWORD){
            res.send( "WRong PAssword");
          } else{
               let q2= ` UPDATE  USER SET USERNAME= "${NEWusername}" WHERE ID="${id}"`;
               connection.query(q2,(err,result)=>{
                if(err) throw err;
                res.redirect("/user");
               })

          }
         
          
        }
      });
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } 
 
   });
    app.get("/user/new",(req,res)=>{
      res.render("add.ejs");
    });
    app.post("/user/new", (req, res) => {
      let { username, email, password } = req.body;
      let id = uuidv4();
      //Query to Insert New User
      let q = `INSERT INTO user (id, username, email, password) VALUES ('${id}','${username}','${email}','${password}') `;
    
      try {
        connection.query(q, (err, result) => {
            if (err) {
            console.log(err);
            res.status(500).send("Error occurred while fetching users");
          } else {
             console.log(" add new user ");
            res.redirect("/user");
            
          }
          
         
        });
      } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
      }
    });
    app.get("/user/:id",(req,res)=>{
      let {id}= req.params;
      let q= `SELECT *FROM USER WHERE ID='${id}'`;
      try{
        connection.query(q,(err,result)=>{
          if(err){
            res.status(500).send(" occured err");
          } else{
            let user= result[0];
           

            res.render("delete.ejs",{user});

          
          }

        })
      }
      catch(err){
        console.log(err);
        res.status(500).send("Internal server errr");
      }
    });
    app.delete("/user/:id", (req, res) => {
      let { id } = req.params;
      let { password } = req.body;
      let q = `SELECT * FROM USER WHERE ID='${id}'`;
    
      try {
        connection.query(q, (err, result) => {
          if (err) throw err;
          let user = result[0];
    console.log(user);
          if (user.PASSWORD != password) {
            res.send("WRONG Password entered!");
          } else {
            let q2 = `DELETE FROM USER WHERE ID='${id}'`; //Query to Delete
            connection.query(q2, (err, result) => {
              if (err) throw err;
              else {
                console.log(result);
                console.log("deleted!");
                res.redirect("/user");
              }
            });
          }
        });
      } catch (err) {
        res.send("some error with DB");
      }
    });

app.listen("8080",()=>{
    console.log(" port is lidting  to");
});

 




 