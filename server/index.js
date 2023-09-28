require('dotenv').config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const routes = require("./routes/routes");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(cors({ origin: "*" }));
app.use(routes);

app.listen(port, () => console.log(`Server listening on port ${port}`));