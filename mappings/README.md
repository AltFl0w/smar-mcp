# Field Mappings

This folder contains the direct field mappings between SmartSheet columns and Odoo fields.

## Files

- **`direct-field-mapping.json`** - Main mapping configuration
- **`use-mapping.js`** - Example script showing how to use the mappings
- **`MAPPING_README.md`** - Detailed documentation
- **`README.md`** - This file

## Quick Start

```javascript
// Load the mapping
import mappingData from './direct-field-mapping.json';

// Get Odoo field for a SmartSheet column
const field = mappingData.mappings.crm_pipeline.columns['Customer'];
console.log(field.odoo_field); // "partner_id.name"
```

## Run Example

```bash
node use-mapping.js
```

## Mapped Sheets

1. **CRM Pipeline** (`crm_pipeline`) - Maps to `crm.lead` model
2. **Customer Payments** (`customer_payments`) - Maps to `account.payment` model

See `MAPPING_README.md` for complete documentation.
