# Specification

## Summary
**Goal:** Add bank account information storage for receiving payments and enable phone-based order pickup identification.

**Planned changes:**
- Add backend data structure to store bank account information (account holder name, bank name, account number, routing number)
- Create admin page with form to enter and update bank account details
- Add navigation link to bank information admin page
- Modify Order data structure to include customer phone number field
- Add phone number input field to checkout form
- Display customer phone number in order confirmation view
- Display customer phone number in admin order management interface for pickup coordination

**User-visible outcome:** Admin can enter and manage bank account information for receiving payments. Customers provide their phone number during checkout, which is displayed on their order confirmation and in the admin order list for easy pickup identification.
