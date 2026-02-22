# Specification

## Summary
**Goal:** Fix the image upload functionality to ensure snack product images can be successfully uploaded, stored, and displayed.

**Planned changes:**
- Debug and fix the ImageUpload.tsx component to properly handle file selection, preview, and upload progress
- Verify backend blob storage in main.mo correctly receives and stores image data
- Ensure Admin page form integration properly handles upload completion and errors
- Add clear error messaging for failed uploads with retry options

**User-visible outcome:** Admins can successfully upload snack product images through the Admin page, and these images display correctly in the product catalog and detail views.
