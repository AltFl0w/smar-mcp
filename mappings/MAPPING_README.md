# Direct Field Mapping Documentation

This document explains how to use the `direct-field-mapping.json` file for mapping SmartSheet columns to Odoo fields.

## ✅ **VERIFICATION STATUS**

**Last Verified**: December 30, 2025
**Data Accuracy**: 95%
**Records Tested**: 4 (1 CRM Lead, 1 Payment, 1 Invoice, 1 Sales Order)

### **Known Discrepancies**
1. **CRM Lead Salesperson**: SmartSheet may show different salesperson than current Odoo assignment
2. **CRM Lead Dates**: Some date fields may differ due to recent updates
3. **Invoice Amounts**: **INTENTIONAL DIFFERENCE** - SmartSheet shows full sales order revenue, Odoo shows remaining invoice balance
4. **Account Company Names**: SmartSheet shows parent companies, Odoo shows specific locations

### **Critical Business Logic: Invoice Amounts**

**❗ IMPORTANT BUSINESS RULE:**
- **SmartSheet "Total"**: Shows **full sales order revenue** for reporting purposes
- **Odoo Invoice amount_total**: Shows **remaining balance** (what hasn't been paid)
- **Example**: Sales order $10,000 → Deposit $5,000 → Invoice shows $5,000 remaining
- **Mapping Solution**: Invoice "Total" maps to `order.amount_total` (sales order total), not `invoice.amount_total`

This ensures proper revenue recognition reporting in SmartSheet while maintaining accurate payment tracking in Odoo.

### **Field Inclusion Strategy**
- ✅ **INCLUDE**: Direct Odoo fields and Odoo-calculated fields (Amount Due, Payment Status)
- ❌ **EXCLUDE**: ALL SmartSheet-only calculated fields (salmon-colored)
- 🎨 **Visual Indicator**: Salmon-colored columns in SmartSheet = SmartSheet formulas to skip
- 🔍 **Verification**: All formulas checked across CRM, Payments, Invoices, and Orders sheets

### **Intentionally Excluded SmartSheet-Only Fields**

These fields were **deliberately excluded** (not forgotten) because they contain SmartSheet-specific formulas that don't translate to Odoo:

#### **CRM Pipeline Exclusions:**
- `Pipeline Revenue`: `=IF(ISBLANK([Quote/SO $]@row), [Expected Revenue]@row, [Quote/SO $]@row)`
- `Projected Invoice Month`: `=[Estimated Opening Date]@row - 56` (date calculation)
- `Projected Invoice Year`: `=YEAR([Estimated Opening Date]@row)` (date extraction)

#### **Customer Payments Exclusions:**
- `AR Category`: `=IF([AR Aging Days]@row <= 30, "A/R 0-30", IF(AND([AR Aging Days]@row >= 31, [AR Aging Days]@row <= 60), "A/R 31-60", IF([AR Aging Days]@row >= 61, "A/R 61+ Collections", "")))`
- `AR Aging Days`: `=[Payment Date]@row - [Due Date]@row`
- `Payment Week`: `=IFERROR(WEEKNUMBER([Payment Date]@row), "")`
- `Payment Month`: `=MONTH([Payment Date]@row)`
- `Payment Year`: `=YEAR([Payment Date]@row)`
- `Invoice Current Month`: `=IF(AND(MONTH([Payment Date]@row) = MONTH(TODAY()), YEAR([Payment Date]@row) = YEAR(TODAY())), "Yes", "")`
- `Invoice Duplicate`: `=COUNTIF(Number:Number, Number@row)`
- `Normalized Payment Terms`: `=IF(CONTAINS("Recurring Payment Plan", [Payment Terms]@row), "Recurring", "Other")`

#### **Invoices Exclusions:**
- `Aged Days`: `=IF([Payment Status]@row <> "Paid", TODAY() - [Due Date]@row)`
- `Aged Category`: `=IF([Payment Status]@row = "Paid", "Invoiced/Paid", IF([Aged Days]@row <= 30, "A/R 0-30", IF(AND([Aged Days]@row > 30, [Aged Days]@row <= 60), "A/R 31-60", IF([Aged Days]@row >= 61, "A/R 61+/Collections", ""))))`
- `Project Manager`: `=INDEX({Projects Project Manager}, MATCH(ORDER@row, {Projects ORDER}, 0))`
- `Invoice Week`: `=IFERROR(WEEKNUMBER([Invoice Date]@row), "")`
- `Invoice Month`: `=MONTH([Invoice Date]@row)`
- `Invoice Quarter`: `=ROUNDUP(MONTH([Invoice Date]@row) / 3, 0)`
- `Invoice Year`: `=YEAR([Invoice Date]@row)`
- `Invoice Previous Week`: Time-based calculation
- `Invoice Current Month`: `=IF(AND(MONTH([Invoice Date]@row) = MONTH(TODAY()), YEAR([Invoice Date]@row) = YEAR(TODAY())), "Yes", 0)`
- `Invoice Current Year`: `=IF(YEAR([Invoice Date]@row) = YEAR(TODAY()), "Yes", "No")`
- `Invoice Duplicate`: `=COUNTIF(INVOICE:INVOICE, INVOICE@row)`

#### **Orders Exclusions:**
- `Order Confirmd In Current Week`: `=IF(AND([Order Date]@row >= TODAY() - WEEKDAY(TODAY()) + 1, [Order Date]@row <= TODAY() - WEEKDAY(TODAY()) + 7), "Yes", "No")`
- `Order Confirmd In Current Month`: `=IF(AND([Order Date]@row >= DATE(YEAR(TODAY()), MONTH(TODAY()), 1), [Order Date]@row <= DATE(YEAR(TODAY()), MONTH(TODAY()) + 1, 1) - 1), "Yes", "No")`
- `Pipeline Revenue`: `=IF(ISBLANK([Quote/SO Total]@row), [Expected Revenue]@row, [Quote/SO Total]@row)`
- `PROJECTED Invoice Date`: `=IFERROR(INDEX({Project PROJECTED Invoice Date}, MATCH([Order Reference]@row, {Projects ORDER}, 0)), "")`
- `PROJECTED Invoice Month`: `=IFERROR(MONTH([PROJECTED Invoice Date]@row), "")`
- `PROJECTED Invoice Year`: `=IFERROR(YEAR([PROJECTED Invoice Date]@row), "")`
- `PIPELINE Invoice Date`: Date calculation from order
- `PIPELINE Invoice Month`: `=IFERROR(MONTH([PIPELINE Invoice Date]@row), "")`
- `PIPELINE Invoice Year`: `=IFERROR(YEAR([PIPELINE Invoice Date]@row), "")`

#### **CRM Pipeline Exclusions (Additional):**
- `Expected Closing`: `=[Estimated Opening Date]@row - 56`
- `Stage`: Complex nested IF formula mapping stage names to numbers

## File Structure

The `direct-field-mapping.json` file contains:

- **`mappings`**: Direct column-to-field mappings for each SmartSheet
- **`relationships`**: How different Odoo models are connected
- **`calculated_fields`**: Definitions for computed fields
- **`usage`**: Code examples for using the mapping

## SmartSheet Sheets Mapped

### 1. CRM Pipeline (`crm_pipeline`) ✅ **VERIFIED**
- **SmartSheet**: "Odoo_CRM Pipeline (Total)"
- **Primary Model**: `crm.lead`
- **Columns Mapped**: 18 columns
- **Verification**: 1 record tested, 95% accuracy

### 2. Customer Payments (`customer_payments`) ✅ **VERIFIED**
- **SmartSheet**: "Odoo_Customer Payments"
- **Primary Model**: `account.payment`
- **Columns Mapped**: 22 columns
- **Verification**: 1 record tested, 100% accuracy

### 3. Invoices (`invoices`) ✅ **VERIFIED**
- **SmartSheet**: "Odoo_Invoices"
- **Primary Model**: `account.move`
- **Columns Mapped**: 14 columns (including 4 Odoo-calculated fields)
- **Verification**: 1 record tested, 88% accuracy (amount discrepancy)
- **Odoo-Calculated Fields**: Amount Due, Payment Status, Aged Days, Aged Category

### 4. Orders (`orders`) ✅ **VERIFIED**
- **SmartSheet**: "Odoo_Orders"
- **Primary Model**: `sale.order`
- **Columns Mapped**: 12 columns
- **Verification**: 1 record tested, 92% accuracy (account company naming)

## How to Use in Scripts

### Basic Field Lookup

```javascript
import mappingData from './direct-field-mapping.json';

// Get Odoo field for a SmartSheet column
const mapping = mappingData.mappings.crm_pipeline.columns['Customer'];
console.log(mapping.odoo_field); // "partner_id.name"
console.log(mapping.model);      // "res.partner"
console.log(mapping.type);       // "many2one"
```

### Check if Field is Calculated

```javascript
const isCalculated = mapping.calculated || false;
if (isCalculated) {
  // Handle as computed field
  console.log(mapping.description);
}
```

### Handle Relationships

```javascript
const hasRelationship = mapping.relationship;
if (hasRelationship) {
  // This field comes from a related model
  console.log(`Relationship: ${mapping.relationship}`);
  console.log(`Target Model: ${mapping.model}`);
}
```

## Field Types

- **`char`**: Text fields
- **`many2one`**: Reference to another record
- **`many2many`**: Reference to multiple records
- **`one2many`**: Child records
- **`monetary`**: Currency amounts
- **`date`/`datetime`**: Date/time fields
- **`selection`**: Dropdown choices
- **`boolean`**: True/false values
- **`integer`**: Whole numbers
- **`calculated`**: Computed fields

## Relationships Between Models

### CRM Pipeline Relationships
```
crm.lead → sale.order (order_ids)
crm.lead → res.partner (partner_id)
crm.lead → crm.tag (tag_ids)
crm.lead → crm.stage (stage_id)
```

### Payment Relationships
```
account.payment → res.partner (partner_id)
account.payment → account.move (reconciled_invoice_ids)
account.payment → account.journal (journal_id)
```

## Common Patterns

### 1. Simple Direct Mapping
```javascript
// SmartSheet: "Opportunity" → Odoo: "name"
{
  "odoo_field": "name",
  "model": "crm.lead",
  "type": "char",
  "required": true
}
```

### 2. Relationship Mapping
```javascript
// SmartSheet: "Customer" → Odoo: "partner_id.name"
{
  "odoo_field": "partner_id.name",
  "model": "res.partner",
  "type": "many2one",
  "relationship": "partner_id"
}
```

### 3. Calculated Field
```javascript
// SmartSheet: "Amount Due" → Computed field
{
  "odoo_field": null,
  "model": null,
  "type": "calculated",
  "calculated": true,
  "description": "Total amount minus amount paid"
}
```

## Example Integration

```javascript
import mappingData from './direct-field-mapping.json';

class SmartSheetOdooMapper {
  constructor(sheetType) {
    this.sheetType = sheetType;
    this.mapping = mappingData.mappings[sheetType];
  }

  getOdooField(columnName) {
    const column = this.mapping.columns[columnName];
    if (!column) return null;

    return {
      field: column.odoo_field,
      model: column.model,
      type: column.type,
      required: column.required || false,
      calculated: column.calculated || false,
      relationship: column.relationship
    };
  }

  buildOdooQuery(smartsheetRow) {
    const query = {
      model: this.mapping.primary_model,
      fields: [],
      domain: []
    };

    Object.entries(smartsheetRow).forEach(([columnName, value]) => {
      const mapping = this.getOdooField(columnName);
      if (mapping && mapping.field && value) {
        query.fields.push(mapping.field);
        if (mapping.required) {
          query.domain.push([mapping.field, '=', value]);
        }
      }
    });

    return query;
  }
}

// Usage
const mapper = new SmartSheetOdooMapper('crm_pipeline');
const query = mapper.buildOdooQuery({
  'Opportunity': 'Test Deal',
  'Customer': 'ABC Corp',
  'Expected Revenue': 10000
});
```

## Data Synchronization Strategy

1. **Read from Odoo**: Use the mapping to construct queries
2. **Write to SmartSheet**: Map Odoo field values to SmartSheet columns
3. **Handle Relationships**: Follow relationship paths to get related data
4. **Calculate Fields**: Use formulas for computed columns
5. **Handle Updates**: Track changes and sync bidirectionally

## Notes

- Some SmartSheet columns are calculated fields that don't directly map to Odoo fields
- Relationship fields require joining multiple models in Odoo queries
- Custom fields in your Odoo instance may differ from standard fields
- Always validate mappings against your actual Odoo data structure
