# Showing how many bids each laptop has

The website can display a **bid count** on every laptop card and in the details
popup, for example: 🔨 `12 bids`, `1 bid`, or `No bids yet`.

## How it works

Your website is static, so it cannot count bids by itself. The bids live in the
**Google Sheet** connected to your bidding Google Form. The website reads a small
**counts-only** summary from that sheet and shows it.

Only the *count* is shown — never who bid or how much. Bids stay sealed.

The count is the number of form **submissions** for that lot (if one person bids
three times, that is 3).

---

## One-time setup

### 1. Open the responses Google Sheet

This is the sheet linked to your bidding form (the one that fills in when someone
submits a bid). Note the exact name of the tab that holds the responses — usually
`Form Responses 1` — and which column holds the **lot number** (for example
column `B`).

### 2. Add a summary tab

1. At the bottom, click **+** to add a new tab.
2. Rename it `BidCounts`.
3. In cell **A1** type `lot_number`, in **B1** type `bids`.
4. In cell **A2** paste this formula (adjust `B` if your lot-number column differs,
   and the tab name if yours is not `Form Responses 1`):

   ```
   =QUERY('Form Responses 1'!B2:B, "select B, count(B) where B is not null group by B label B 'lot_number', count(B) 'bids'", 0)
   ```

   This automatically lists each lot number and how many bids it has, and updates
   itself whenever a new bid arrives.

### 3. Publish only the summary tab

1. **File → Share → Publish to web**.
2. In the first dropdown, choose the **`BidCounts`** tab (NOT "Entire document").
3. In the second dropdown, choose **Comma-separated values (.csv)**.
4. Click **Publish** and confirm. Copy the link it gives you.

> Important: publish the `BidCounts` tab only. Never publish the full responses
> sheet — that would expose bidders' names and amounts.

### 4. Put the link into the website

Open `config.js` and paste the link between the quotes:

```js
bidCountsUrl: "https://docs.google.com/spreadsheets/d/e/XXXX/pub?gid=YYYY&single=true&output=csv",
```

Save, commit, and push to GitHub. Vercel redeploys automatically.

---

## Notes

- Leave `bidCountsUrl` blank to hide bid counts completely — the site works fine
  without it.
- Google may cache the published CSV for a few minutes, so counts can lag slightly
  behind real time. That is normal.
- Lot numbers in the sheet must match the `lot_number` values in
  `data/laptops.csv` exactly.
- A laptop with no submissions (or not yet in the sheet) shows `No bids yet`.
