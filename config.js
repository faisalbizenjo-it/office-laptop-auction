window.AUCTION_CONFIG = {
  organizationName: "KODERLABS Laptop Auction",
  pageTitle: "KODERLABS Laptop Auction",
  heroEyebrow: "KODERLABS employee auction",
  heroTitle: "KODERLABS office laptops, available for employee bidding.",
  heroText:
    "Browse available KODERLABS laptops, compare specifications and place your bid through the employee auction form.",

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

  // LIVE BID COUNTS (optional)
  // Public CSV link of a Google Sheet tab that lists how many bids each lot has.
  // The tab must have two columns with these exact headers: lot_number,bids
  // In Google Sheets: File > Share > Publish to web > choose that tab > CSV.
  // Leave blank to hide bid counts entirely.
  bidCountsUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTouHhTxYl_W-nTftNIyogXG-hPu70Hlfbl7ImWy3sap0JBRSiRfEe77s8vg-AaFmogXafDlbF_nZ6j/pub?gid=654057997&single=true&output=csv",

  currencyLocale: "en-PK",
  defaultCurrency: "PKR",
  dataFile: "data/laptops.csv",
  imagesFolder: "images/"
};
