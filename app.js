if (process.env.NODE_ENV !== "production") {
  require("dotenv").config(); // Load environment variables from .env file
}

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const User = require("./models/user.js");
const localStrategy = require("passport-local");

// Set up EJS as the view engine
app.set("public", path.join(__dirname, "public"));
app.engine("ejs", ejsmate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const ExpressError = require("./utils/ExpressError.js");

const dbUrl = process.env.ATLUSTDB_URL;
main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});
store.on("error",()=>{
  console.log("Error from mongo session store")
})

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  Cookie: {
    expires: Date.now() + 7 + 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/demoUser", async (req, res) => {
  const fakeUser = new User({
    email: "fakeUser@gmail.com",
    username: "fakeUser",
  });
  await User.register(fakeUser, "fakePassword");
  res.send("Demo user created");
});

// ........Middleware to set flash messages
app.use((req, res, next) => {
  res.locals.success = req.flash("success"); // Set success messages for flash.ejs
  res.locals.error = req.flash("error"); // Set error messages for flash.ejs
  res.locals.currUser = req.user; // Set current user in response locals for navbar
  next();
});

// connecting to listing.js file in routes folder
app.use("/listings", listingRouter);
// connecting to review.js file in routes folder
app.use("/listings/:id/reviews", reviewRouter);
// connecting to user.js file in routes folder
app.use("/", userRouter);

// Error handling middleware
app.use("/" ,(req,res,next)=>{
  throw new ExpressError(400,"please click on icon or explore button to visit site");
  next();
})
app.use((err, req, res, next) => {
  let { statusCode, message } = err;
  res.render("./listings/error.ejs", { message });
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});

// app.get("/test",(req,res)=>{
//     let simpleListing = new Listing({
//         title: "Test Listing",
//         description: "This is a test listing",

//         price: 100,
//         location: "Test Location",
//         country: "Test Country"
//     })
//     simpleListing.save();
//     res.send("Test listing created");
//     console.log("Test listing created");
// })