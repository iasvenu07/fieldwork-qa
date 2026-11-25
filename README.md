# Fieldwork Supply

Fieldwork Supply is a self-contained e-commerce application for a manual QA portfolio. Orders are simulated. Use only fictional aliases and passphrases. The practice accounts and cart are stored in the current browser profile, and the latest receipt is available until the tab reloads or you sign out.

## Run locally

1. If you downloaded the ZIP, extract it.
2. Open **index.html** in a current browser. Keep **style.css** and **app.js** next to it. Internet access, installation, and a server are unnecessary.
3. Use **demo** / **demo-pass**, or register a fictional alias such as **tester_01** with **practice-only** as its demo passphrase.
4. Shop for an item, open the cart, and complete the checkout with a fictional preset address.

If browser settings restrict local-file storage, the app works in the current tab and changes may be lost on reload. An optional alternative is to run `py -m http.server 8000 --bind 127.0.0.1` from the app folder with Python installed and visit `http://127.0.0.1:8000`.

## Practice and retest

**QA Lab** contains manual test cases and three expandable reports for deliberately seeded functional defects. Seeded mode is enabled on first launch. Run the cases before opening the defect reports if you want to practice discovery. Turn seeded mode off for baseline retests. **Reset demo data** clears local accounts and cart contents and restores seeded mode.

| Defect | Case | Actual in seeded mode |
| --- | --- | --- |
| BUG-001 | TC-04 | High-to-low price sort displays ascending prices |
| BUG-002 | TC-06 | Cart badge counts distinct products instead of units |
| BUG-003 | TC-08 | An exact $100 subtotal gets an $8 shipping charge |

## Portfolio worksheets

Use **QA-PORTFOLIO.md** for a starter test plan, traceability matrix, execution record, and bug report template. Record the environment, your own observed results, and evidence from your own test run. Label any published reports from this app as intentionally seeded practice defects.

## Automated smoke check

With Node.js installed, run `node tests/smoke.cjs` from the project directory. The check exercises storefront logic and compares all three seeded defects with baseline behavior. Use QA Lab for browser layout and keyboard checks.
