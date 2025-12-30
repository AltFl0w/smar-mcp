# Odoo Field Verification Results

## Instructions for Verification

**Run these commands in Cursor** (not in terminal) to verify the field mappings:

### 1️⃣ Check Model Fields:
```
Show me all fields in the crm.lead model in my Odoo system
Show me all fields in the sale.order model in my Odoo system
Show me all fields in the account.payment model in my Odoo system
Show me all fields in the account.move model in my Odoo system
```

### 2️⃣ Verify Specific Field Existence:
```
In my Odoo system, does the crm.lead model have these fields?
Fields to check: name, partner_id.name, expected_revenue, stage_id.name, date_deadline

In my Odoo system, does the sale.order model have these fields?
Fields to check: name, amount_total, amount_paid, amount_residual, partner_id.name, user_id.name, date_order, signed_on, state

In my Odoo system, does the account.payment model have these fields?
Fields to check: name, date, amount, partner_id.name, journal_id.name, payment_method_id.name, state

In my Odoo system, does the account.move model have these fields?
Fields to check: name, move_type, partner_id.name, invoice_date_due, invoice_payment_term_id.name, invoice_line_ids.name, payment_state
```

### 3️⃣ Check Sample Data:
```
Show me 3 recent records from the crm.lead model in my Odoo system
Show me 3 recent records from the sale.order model in my Odoo system
Show me 3 recent records from the account.payment model in my Odoo system
Show me 3 recent records from the account.move model in my Odoo system
```

## Expected Results

### ✅ crm.lead Model Should Have:
- `name` (Char) - Lead/Opportunity name
- `partner_id` (Many2one → res.partner) - Customer reference
- `user_id` (Many2one → res.users) - Salesperson
- `expected_revenue` (Monetary) - Expected revenue amount
- `stage_id` (Many2one → crm.stage) - Lead stage
- `date_deadline` (Date) - Expected closing date
- `tag_ids` (Many2many → crm.tag) - Lead tags

### ✅ sale.order Model Should Have:
- `name` (Char) - Order reference
- `amount_total` (Monetary) - Total order amount
- `amount_paid` (Monetary) - Amount paid
- `amount_residual` (Monetary) - Amount due
- `partner_id` (Many2one → res.partner) - Customer
- `user_id` (Many2one → res.users) - Salesperson
- `date_order` (DateTime) - Order date
- `state` (Selection) - Order status

### ✅ account.payment Model Should Have:
- `name` (Char) - Payment reference
- `date` (Date) - Payment date
- `amount` (Monetary) - Payment amount
- `partner_id` (Many2one → res.partner) - Customer
- `journal_id` (Many2one → account.journal) - Payment journal
- `payment_method_id` (Many2one → account.payment.method) - Payment method
- `state` (Selection) - Payment state

### ✅ account.move Model Should Have:
- `name` (Char) - Move reference
- `move_type` (Selection) - Move type (invoice, payment, etc.)
- `partner_id` (Many2one → res.partner) - Customer
- `invoice_date_due` (Date) - Due date
- `payment_state` (Selection) - Payment state
- `invoice_line_ids` (One2many → account.move.line) - Invoice lines

## Verification Checklist

After running the commands in Cursor, verify:

- [ ] All expected fields exist
- [ ] Field types match (Char, Date, Monetary, Many2one, etc.)
- [ ] Relationship fields point to correct models
- [ ] Field names are exactly as mapped
- [ ] Sample data looks realistic and matches expected structure

## Next Steps After Verification

Once verified, the mappings in `odoo-smartsheet-mapping.json` can be used to:
1. Import Smartsheet data into Odoo
2. Sync data between systems
3. Build automated workflows
4. Create unified reports
