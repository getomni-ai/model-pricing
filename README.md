# Model Pricing Library

This package exports `getModelPricing` which returns a pricing calculation for a combination of:

- `sequence` - Amino acid sequence with mask tokens (`ACDEFGHIKLMNPQRSTVWY<mask>`)
- `tracks` - Array of tracks
- `model` - Model identifyier: esm, abdiffusion, etc.
- `transform` - Transform type: FILL_MASK, EMBEDDING, etc.
