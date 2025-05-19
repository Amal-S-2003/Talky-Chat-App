
require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const router = require("./routes/route");
require("./db/connection");
const {app,server} =require('./libs/socket')

app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(cors(
  {origin:"http://localhost:5174",
    credentials:true
  }
))
app.use(router);
const PORT = 3000;

server.listen(PORT, () => {
  console.log(
    `server started running at PORT:${PORT} & waiting for client request`
  );
});

