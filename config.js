window.AUCTION_CONFIG = {
  organizationName: "In-House Laptop Auction",
  pageTitle: "Office Laptop Auction",
  heroEyebrow: "Company equipment sale",
  heroTitle: "Reliable office laptops, ready for a new home.",
  heroText:
    "Browse retired in-house laptops, compare specifications and review each lot before placing a bid.",

  // GOOGLE FORM BIDDING
  // Paste your Google Forms pre-filled link below.
  // Replace the sample lot value with {lot_number}
  // Replace the sample laptop-title value with {listing_title}
  //
  // Example format:
  // bidFormUrl:
  //   "https://docs.google.com/forms/d/e/FORM_ID/viewform?usp=pp_url&entry.111111={lot_number}&entry.222222={listing_title}",
  bidFormUrl: "https://docs.google.com/forms/d/e/1FAIpQLSf6miJ4n4JsQiLdE-zycLKDRgtyn82fwQAS1GKt-DnxWSc5Gw/viewform",

  // Optional fallback. Used only when bidFormUrl is blank.
  supportEmail: "",

  currencyLocale: "en-PK",
  defaultCurrency: "PKR",
  dataFile: "data/laptops.csv",
  imagesFolder: "images/"
};
