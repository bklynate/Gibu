const express = require('express');
const methodOverride = require('method-override');
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;
const routes = require('router')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type: "application/vnd.api+json"}));
app.use(express.static("public"));
app.use(methodOverride("_method"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.set('port', (process.env.PORT || 3000));

app.use(routes);

app.listen(PORT, () => console.log("..only some of us made it..."))
