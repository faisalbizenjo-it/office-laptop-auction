# Google Form link status

The website is currently connected to:

https://docs.google.com/forms/d/e/1FAIpQLSf6miJ4n4JsQiLdE-zycLKDRgtyn82fwQAS1GKt-DnxWSc5Gw/viewform

Every **Bid now** button opens this form in a new browser tab.

## Automatic lot-number and laptop-title filling

The supplied URL is the normal public form URL. It does not contain the Google Forms
`entry.########` field identifiers required for automatic pre-filling.

To enable automatic pre-filling:

1. Open the form editor.
2. Select the three-dot menu and choose **Pre-fill form**.
3. Enter `SAMPLE-LOT` in **LOT-Number**.
4. Enter `SAMPLE-LAPTOP` in **Laptop Title**.
5. Select **Get link** and copy that generated link.
6. Replace `SAMPLE-LOT` with `{lot_number}`.
7. Replace `SAMPLE-LAPTOP` with `{listing_title}`.
8. Put the resulting URL into `bidFormUrl` in `config.js`.
