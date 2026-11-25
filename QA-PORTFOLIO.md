# Manual Test Artifacts & Real Bug Report Portfolio

## Test plan

**Application:** Fieldwork Supply, local practice build  
**Objective:** Verify storefront requirements and document reproducible issues with evidence.  
**Scope:** Registration, sign-in, catalog, stock limits, cart, simulated checkout, sign-out, and responsive navigation.  
**Approach:** Run manual functional and negative cases, compare seeded and baseline results, then explore inventory and shipping boundaries.  
**Environment to record:** Build or commit, browser and version, operating system, viewport, date, and defect mode.  
**Entry criteria:** The app opens and six catalog items appear after clearing filters.  
**Exit criteria:** Every planned case has a recorded outcome. Every failure has an evidence link or an explanation.  
**Data:** demo / demo-pass, tester_01 / practice-only, and the preset fictional delivery addresses. Use a fresh alias or reset before repeating registration.

## Requirement traceability matrix

| Requirement | Test cases in QA Lab | Seeded defect |
| --- | --- | --- |
| R-01 Accept unique demo alias and reject duplicates | TC-01 | |
| R-02 Verify login and clear session on logout | TC-02, TC-10 | |
| R-03 Combine name search with category filters | TC-03 | |
| R-04 Sort prices in the selected direction | TC-04 | BUG-001 |
| R-05 Enforce stock and allow cart edits | TC-05, TC-07 | |
| R-06 Show the number of units in the cart badge | TC-06 | BUG-002 |
| R-07 Waive shipping at or above a $100 subtotal | TC-08 | BUG-003 |
| R-08 Require login and a demo address to simulate an order | TC-09 | |
| R-09 Support storefront navigation on a narrow screen | TC-11 | |

## Test execution record

Copy a row for each case and record each mode separately. Use Pass, Fail, Blocked, or Not Run.

| Date | Case | Mode | Environment | Status | Actual result | Evidence or linked defect |
| --- | --- | --- | --- | --- | --- | --- |
| | | | | Not Run | | |

## Defect report template

- **ID and summary**
- **Classification** — intentionally seeded practice defect or other observed behavior in the local demo
- **Environment and mode**
- **Linked requirement and test case**
- **Preconditions and test data**
- **Numbered reproduction steps**
- **Expected result**
- **Actual result and reproducibility**
- **Severity, priority, and status**
- **Evidence** — screenshot, recording, or notes with fictional data only
- **Baseline retest result**

## Test summary template

| Mode | Planned | Passed | Failed | Blocked | Not run |
| --- | --- | --- | --- | --- | --- |
| Seeded | 11 | | | | |
| Baseline | 11 | | | | |

Record the most important findings, any gaps in coverage, and whether each linked defect passed its baseline retest.
