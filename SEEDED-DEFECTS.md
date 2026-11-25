# Seeded defect reports

These three defects were deliberately introduced in the Fieldwork Supply practice app. Report them as intentionally seeded portfolio exercises. The [automated smoke test](tests/smoke.cjs) checks the affected behavior in both modes. Browser observations and screenshots can be recorded during a manual run.

## BUG-001 — High-to-low sorting displays ascending prices

**Severity** Medium · **Coverage** R-04 / [TC-04](MANUAL-TEST-CASES.md) · **Status** Seeded

1. Enable seeded defects in QA Lab.
2. Open Shop and clear search and category filters.
3. Select **Price: high to low**.

**Expected** Studio Headphones ($119.00) appears first and Stoneware Mug ($18.00) appears last.

**Seeded result** Stoneware Mug appears first and Studio Headphones appears last.

**Baseline retest** Disable seeded defects, return to Shop, and verify descending order.

## BUG-002 — Cart badge counts distinct products

**Severity** Low · **Coverage** R-06 / [TC-06](MANUAL-TEST-CASES.md) · **Status** Seeded

1. Enable seeded defects and start with an empty cart.
2. Add Trail Daypack twice.
3. Compare the header badge with the item quantity in Cart.

**Expected** The header shows Cart 2 and the item quantity is two.

**Seeded result** The header shows Cart 1 while the item quantity is two.

**Baseline retest** Disable seeded defects and verify the header shows Cart 2 with the same cart contents.

## BUG-003 — Orders at exactly $100 are charged shipping

**Severity** Medium · **Coverage** R-07 / [TC-08](MANUAL-TEST-CASES.md) · **Status** Seeded

1. Enable seeded defects and start with an empty cart.
2. Add Camp Lantern twice at $32.00 each and Stoneware Mug twice at $18.00 each.
3. Open Cart and inspect the order summary.

**Expected** The $100.00 subtotal qualifies for free shipping and the total is $100.00.

**Seeded result** Shipping costs $8.00 and the total is $108.00.

**Baseline retest** Disable seeded defects, return to Cart, and verify shipping is free and the total is $100.00.
