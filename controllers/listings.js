const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("./listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  const allListings = await Listing.findById(req.params.id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

  if (!allListings) {
    req.flash("error", "Listing you request for does not exists!");
    res.redirect("/listings");
  } else {
    res.render("./listings/show.ejs", { allListings });
  }
};

module.exports.createListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  const newListings = new Listing(req.body.listings);
  newListings.owner = req.user._id; // Set the owner of the listing to the current user
  newListings.image = { url, filename };
  await newListings.save();
  req.flash("success", "Successfully created a new listing!");
  res.redirect("/listings");
};
module.exports.renderEditForm = async (req, res) => {
  const listings = await Listing.findById(req.params.id);
  if (!listings) {
    req.flash("error", "Listing you request for does not exists!");
    res.redirect("/listings");
  } else {
    let originalImgUrl = listings.image.url;
    originalImgUrl = originalImgUrl.replace("/uploads","/uploads/w_250")
    res.render("./listings/edit.ejs", { listings , originalImgUrl });
  }
};

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  const listings = await Listing.findByIdAndUpdate(id, {
    ...req.body.listings,
  });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listings.image = { url, filename };
    await listings.save();
  }

  req.flash("success", "listing updated Successfully!");
  res.redirect(`/listings/${id}`);
};
module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "listing Deleted !");

  res.redirect("/listings");
};
