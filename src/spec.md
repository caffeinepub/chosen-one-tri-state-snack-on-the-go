# Specification

## Summary
**Goal:** Remove product deletion capability from public-facing views to prevent unauthorized deletion of catalog items.

**Planned changes:**
- Remove delete button and delete functionality from ProductCard component
- Remove delete button and delete functionality from ProductDetail page
- Preserve admin delete capability in SnackManagement admin page

**User-visible outcome:** Public users can view products and add them to cart but cannot delete products from the catalog or detail pages. Only admin users retain product deletion capability through the admin panel.
