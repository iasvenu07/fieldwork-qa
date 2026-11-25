# Manual test cases

Open `index.html` as described in the [README](README.md). Record your browser, viewport, build, and mode in the [execution record](QA-PORTFOLIO.md#test-execution-record). Run the cases in baseline mode for expected behavior. Repeat TC-04, TC-06, and TC-08 with seeded mode on and compare your observations with the [defect reports](SEEDED-DEFECTS.md).

Start each cart case with an empty cart. Use fictional data only. QA Lab’s reset clears local accounts and cart and switches seeded mode back on.

| Case | Area | Steps | Expected result |
| --- | --- | --- | --- |
| TC-01 | Registration | Register a fresh alias with a fictional passphrase of at least eight characters. Sign out and repeat with the same alias. | The first registration signs you in. The duplicate alias is rejected. |
| TC-02 | Sign-in | Submit `demo` with an incorrect passphrase. Retry with `demo-pass`. | The first attempt shows an error. The second signs you in. |
| TC-03 | Search and filter | Search for `camp`. Select Tech. Clear the search and choose All categories. | Camp Lantern is the sole initial result. The combined search and filter return zero matches. Clearing both restores six products. |
| TC-04 | Price sort | Clear filters. Select Price: low to high and check the first and last products. Repeat with Price: high to low. | The first and last products swap between Stoneware Mug ($18.00) and Studio Headphones ($119.00). |
| TC-05 | Inventory limit | Verify Desk Planter’s stock status. Add Studio Headphones, then attempt to update its cart quantity to five. | Desk Planter is unavailable. The cart rejects five headphones because only four are available. |
| TC-06 | Cart badge | Add Trail Daypack twice. Compare the header badge with the line quantity in Cart. | The badge and line quantity both show two. |
| TC-07 | Cart editing | Add two Trail Daypacks. Update the quantity to one. Reload, then remove the item. | The updated quantity survives reload. Removing the item leaves an empty cart. |
| TC-08 | Shipping threshold | Add two Camp Lanterns and two Stoneware Mugs. Open Cart. | Subtotal is $100.00, shipping is free, and total is $100.00. |
| TC-09 | Simulated checkout | While signed out, add one Stoneware Mug and continue to checkout. Sign in. Try to submit without an address, then choose a preset address, acknowledge the simulation, and submit. | Checkout requires sign-in and an address. The valid submission shows a demo receipt and empties the cart. |
| TC-10 | Sign-out | Sign in, sign out from Account, reload, and open Account. | The sign-in form appears after reload. |
| TC-11 | Narrow screen | At a 375-pixel viewport, navigate Shop, Cart, and QA Lab with Tab, Enter, and the pointer. | Controls remain reachable with visible focus, and the page has no horizontal overflow. |
