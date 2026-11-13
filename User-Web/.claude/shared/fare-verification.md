# User-Web shared procedure: mandatory fare verification (all trip categories)

**Scope:** applies to **every User-Web trip category**: Local, Outstation, Transfer (all sub-types), Multi-Leg, and any category
or module added in future. It is mandatory whenever fare calculation is in the scope of testing.
It doesn't depend on any category. **Every User-Web category skill must reference this file** (see "How skills use this file" below).

**Procedure:**

1. Go to the **vehicle selection page** for the trip category under test.
2. Identify the **vehicle planned for selection** in the current combination.
3. Open that vehicle's details (e.g. *View Full Vehicle Details*) and go to its **Fare Breakup** section **before** validating any fare.
4. Inspect and record every fare component shown:
   - Base fare
   - Included hours and included kilometres
   - Extra-hour charge and per-hour rate
   - Extra-kilometre charge and per-km rate
   - Driver bata / allowance (where applicable)
   - Night charges (where applicable)
   - Toll, parking and permit charges (where applicable)
   - Other additional charges
   - Taxes
   - Final payable amount
5. Work out which components apply to **this trip category and this vehicle**. Record which are applicable, not applicable, or not shown.
6. After selecting the vehicle, compare the **fare actually applied** (review/summary step, stopping before the final submit)
   against that vehicle's Fare Breakup.
7. Check that the **individual charges and the calculated total** are consistent with the fare rules displayed.
   Show the arithmetic in the results (e.g. base + extra hours × rate + … + taxes = total).
8. **Boundary testing** (extra hours, extra kilometres, additional days, etc.): compare the baseline and boundary scenarios on the
   **same vehicle**, keeping **every other input identical**. Change only the boundary variable.
9. Capture screenshots of the vehicle's **Fare Breakup** and of the **applied fare**, as evidence for every fare check
   (`screenshots/<category>/<run-id>/<TC-ID>-fare-breakup.png`, `…-applied-fare.png`, with personal data masked).
10. If a fare component or pricing rule is **not shown or is unclear**, record it as **"Needs business/developer clarification"**.
    **Never assume a rate or invent an expected amount.** A fare check whose rule isn't confirmed is reported as
    `Inconclusive – fare rule not confirmed`, never Pass or Fail.

**Rules:**

- **Never validate a fare using only the vehicle card's "Starts From" price.** It may be recorded as supporting data only.
- Don't assume all trip categories use the same fare calculation. Fare components can differ by vehicle and trip category.
- A boundary check is only evaluated if the app actually recognises the boundary input. For example, if a route shows a distance
  at or below the included kilometres, the extra-km check is `Inconclusive` and the wrong distance is recorded as a separate defect.
- The procedure stays read-only: opening details and the Fare Breakup never submits anything. The final submit still needs approval (the calling skill's rules section).
- **Report:** each fare check in the calling skill's HTML report shows the recorded Fare Breakup components, the applied fare, the comparison
  and arithmetic, the verdict, evidence links, and any open clarifications.

## How skills use this file

- This is the **single source** for fare verification. Don't copy it into category skills; change it here only.
- Every User-Web category skill (Local, Outstation, Transfer, Multi-Leg, and any future one) must:
  1. Have a section "Mandatory fare verification" that says: *Read and follow `User-Web/.claude/shared/fare-verification.md` in full before any fare-related test step.*
  2. Point to this file from its execution step and its report section.
- Skills using it today: `user-web-local`.
