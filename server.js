const express = require("express");
const app = express();
// const cors = require('cors')
// app.use(cors())
const server = require("http").Server(app);
const io = require("socket.io")(server);

const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});
app.use("/peerjs", peerServer);
const { v4: uuidV4 } = require("uuid");
app.set("view engine", "ejs");
app.use(express.static("public"));

const passport = require("passport");
const cookieSession = require("cookie-session");
require("./passport");

var Uname = "Guest";

//////google///////////
app.use(
  cookieSession({
    name: "google-auth-session",
    keys: ["key1", "key2"],
  })
);
// const isLoggedIn = (req, res, next) => {
//   if (req.user) {
//       next();
//   } else {
//       res.sendStatus(401);
//   }
// }

app.use(passport.initialize());
app.use(passport.session());

app.get("/failed", (req, res) => {
  res.send("Failed");
});
// app.get("/success", isLoggedIn,(req, res) => {
//   res.send(`Welcome ${req.user.email}`)
// })
app.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);
app.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/failed",
  }),
  function (req, res) {
    Uname = req.user.given_name;
    res.redirect("/Join");
    // res.redirect('/success')
    // res.render('joinmeet',{roomId:uuidV4(),
    //   uname:req.user.given_name
    // });
  }
);

app.get("/logout", (req, res) => {
  req.session = null;
  req.logout();
  res.redirect("/");
});

///////////////////////

app.get("/", (req, res) => {
  res.render("welcome");
  // res.redirect(`/${uuidV4()}`)
});
app.get("/Ended", (req, res) => {
  res.render("meetended");
  // res.redirect(`/${uuidV4()}`)
});
app.get("/Join", (req, res) => {
  res.render("joinmeet", { roomId: `${uuidV4()}`, uname: Uname });
  // res.redirect(`/${uuidV4()}`)
});

app.get("/Overview", (req, res) => {
  res.render("overview");
  // res.redirect(`/${uuidV4()}`)
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room, uname: Uname });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userId);
    // messages
    socket.on("message", (message, una) => {
      //send message to the same room
      io.to(roomId).emit("createMessage", message, una);
    });
    socket.on("myname", (nap) => {
      //send message to the same room
      io.to(roomId).emit("newname", nap);
    });

    socket.on("draw", (data) => {
      //send message to the same room
      io.to(roomId).emit("ondraw", data);
    });
    socket.on("down", (data) => {
      //send message to the same room
      io.to(roomId).emit("ondown", data);
    });
    socket.on("disconnect", () => {
      socket.to(roomId).emit("user-disconnected", userId);
    });
  });
});

server.listen(3030);
