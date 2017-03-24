const express = require('express');
const methodOverride = require('method-override');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;
const routes = require('./routes/router');
const flash = require('connect-flash');
const passport = require('passport');
const passportConfig = require('./config/passport');
const db = require('./models');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type: "application/vnd.api+json"}));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(flash());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
//=============================
//=====PASSPORT CONFIG=========
//=============================
app.use(require("express-session")({
  secret: "56sdf12333ngh4j11115;3l;4l;34346q467563457437282910",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

//=============================
//=========MIDDLEWARE==========
//=============================
app.use(function(request, response, next){
  response.locals.currentUser = request.user;
  response.locals.error = request.flash("error");
  response.locals.success = request.flash("success");
  next();
});

app.use(routes);

db.sequelize.sync({}).then(function() {
  app.listen(PORT, () => console.log("..only some of us made it..."));
})
