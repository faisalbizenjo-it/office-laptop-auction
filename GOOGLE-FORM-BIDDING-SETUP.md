# Google Form bidding setup

The website now has a **Bid now** button on every laptop card and an **Open bid form** button in every laptop detail window.

The selected laptop's lot number and listing title can be filled automatically in one shared Google Form.

## 1. Create the Google Form

Create a form named:

`Employee Laptop Auction Bid`

Recommended questions:

1. **Lot number** — Short answer — Required
2. **Laptop title** — Short answer — Required
3. **Employee full name** — Short answer — Required
4. **Employee ID** — Short answer — Required
5. **Department** — Short answer or dropdown — Required
6. **Bid amount (PKR)** — Short answer — Required
7. **Mobile number** — Short answer — Optional
8. **Confirmation** — Checkbox — Required  
   Example: `I understand that a submitted winning bid is a commitment to purchase.`

For **Bid amount**, use response validation:
- Number
- Greater than or equal to
- Enter the minimum bid rule required by your auction

## 2. Form settings

Recommended:

- Collect email addresses when employees have company Google accounts.
- Restrict the form to your organization when appropriate.
- Do **not** enable “Limit to 1 response” when employees must be allowed to bid on more than one laptop.
- Link responses to a Google Sheet.
- Add auction terms in the form description.

A single Google Form collects bids for every laptop. The lot number identifies which laptop is being bid on.

## 3. Generate the pre-filled link

1. Open the Google Form in edit mode.
2. Click the three-dot **More** menu.
3. Select **Pre-fill form**.
4. In **Lot number**, enter exactly: `SAMPLE-LOT`
5. In **Laptop title**, enter exactly: `SAMPLE-LAPTOP`
6. Leave employee name, ID, department and bid amount blank.
7. Click **Get link**.
8. Copy the generated link.

It will look similar to:

```text
https://docs.google.com/forms/d/e/FORM_ID/viewform?usp=pp_url&entry.111111=SAMPLE-LOT&entry.222222=SAMPLE-LAPTOP
```

## 4. Convert it into the website template

Change:

- `SAMPLE-LOT` to `{lot_number}`
- `SAMPLE-LAPTOP` to `{listing_title}`

Final example:

```text
https://docs.google.com/forms/d/e/FORM_ID/viewform?usp=pp_url&entry.111111={lot_number}&entry.222222={listing_title}
```

Keep your real `entry.########` numbers. They are generated uniquely for your form.

## 5. Put the link into the website

Open `config.js` and locate:

```js
bidFormUrl: "",
```

Paste the template link between the quotation marks:

```js
bidFormUrl:
  "https://docs.google.com/forms/d/e/FORM_ID/viewform?usp=pp_url&entry.111111={lot_number}&entry.222222={listing_title}",
```

Save the file.

## 6. Deploy the update

Upload these changed files to the existing GitHub repository:

- `index.html`
- `styles.css`
- `app.js`
- `config.js`

Commit the changes to the production branch, normally `main`.

Vercel should automatically create a new production deployment.

## 7. Test before announcing the auction

1. Open the deployed website.
2. Click **Bid now** on one laptop.
3. Confirm that the Google Form opens in a new tab.
4. Confirm that the correct lot number and laptop title are pre-filled.
5. Enter a test bid and submit it.
6. Confirm that the response appears in the linked Google Sheet.
7. Delete the test response before the auction opens.

## How bids will work

1. Employee opens a laptop listing.
2. Employee clicks **Bid now**.
3. Google Form opens with the laptop already identified.
4. Employee enters their identity and bid amount.
5. Google Forms records the submission time.
6. The response is stored in the connected Google Sheet.
7. At the deadline, the auction administrator filters by lot number and selects the highest valid bid.

This version does not display the current highest bid publicly. It collects sealed bids in Google Forms.
