// Odoo Field Verification Script for Cursor
// Run this in Cursor to verify Odoo field mappings

console.log('🔍 ODOO FIELD VERIFICATION - Copy these commands to Cursor');
console.log('=' .repeat(60));

// Commands to run in Cursor
const commands = [
  {
    title: 'CRM Lead Model Fields',
    command: 'Show me all fields in the crm.lead model in my Odoo system',
    description: 'Check if crm.lead has: name, partner_id, expected_revenue, stage_id, date_deadline'
  },
  {
    title: 'Sales Order Model Fields',
    command: 'Show me all fields in the sale.order model in my Odoo system',
    description: 'Check if sale.order has: name, amount_total, partner_id, user_id, state'
  },
  {
    title: 'Payment Model Fields',
    command: 'Show me all fields in the account.payment model in my Odoo system',
    description: 'Check if account.payment has: name, amount, date, partner_id, state'
  },
  {
    title: 'Invoice Model Fields',
    command: 'Show me all fields in the account.move model in my Odoo system',
    description: 'Check if account.move has: name, move_type, partner_id, invoice_date_due'
  },
  {
    title: 'Sample CRM Data',
    command: 'Show me 3 recent records from the crm.lead model in my Odoo system',
    description: 'See actual data structure'
  },
  {
    title: 'Sample Sales Data',
    command: 'Show me 3 recent records from the sale.order model in my Odoo system',
    description: 'See actual sales order data'
  }
];

commands.forEach((cmd, index) => {
  console.log(`\n${index + 1}. ${cmd.title}`);
  console.log(`Command: ${cmd.command}`);
  console.log(`Purpose: ${cmd.description}`);
  console.log('-'.repeat(40));
});

console.log('\n📋 VERIFICATION CHECKLIST:');
console.log('✅ Field exists in Odoo model');
console.log('✅ Field data type matches mapping (Char, Date, Monetary, Many2one)');
console.log('✅ Relationship fields reference correct models');
console.log('✅ Sample data shows expected structure');

console.log('\n🎯 EXPECTED FIELDS FROM OUR MAPPING:');

const expectedFields = {
  'crm.lead': ['name', 'partner_id', 'user_id', 'expected_revenue', 'stage_id', 'date_deadline'],
  'sale.order': ['name', 'amount_total', 'amount_paid', 'partner_id', 'user_id', 'date_order', 'state'],
  'account.payment': ['name', 'amount', 'date', 'partner_id', 'journal_id', 'state'],
  'account.move': ['name', 'move_type', 'partner_id', 'invoice_date_due', 'payment_state']
};

Object.entries(expectedFields).forEach(([model, fields]) => {
  console.log(`\n${model}:`);
  fields.forEach(field => console.log(`  - ${field}`));
});

console.log('\n🚀 After verification, update odoo-smartsheet-mapping.json if any fields differ!');
