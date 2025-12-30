import { readFileSync } from 'fs';

const mapping = JSON.parse(readFileSync('odoo-smartsheet-mapping.json', 'utf8'));

console.log('🔍 ODOO FIELD VERIFICATION SCRIPT');
console.log('=' .repeat(60));
console.log('\n📋 Copy these commands to ask Cursor to verify Odoo fields:\n');

const models = [...new Set(mapping.mappings.map(m => m.odoo_model))];

models.forEach(model => {
  console.log(`🔹 MODEL: ${model}`);
  console.log(`Ask Cursor: "Show me all fields in the ${model} model in my Odoo system"`);

  const modelMappings = mapping.mappings.filter(m => m.odoo_model === model);
  const fields = [...new Set(modelMappings.flatMap(m => m.field_mappings.map(f => f.odoo_field)))];

  console.log(`Expected fields to verify:`);
  fields.forEach(field => {
    console.log(`  - ${field}`);
  });

  // Find Smartsheet columns that map to this model
  const smartsheetColumns = modelMappings.flatMap(m =>
    m.field_mappings.map(f => `${f.smartsheet_column} → ${f.odoo_field}`)
  );

  console.log(`Smartsheet → Odoo mappings:`);
  smartsheetColumns.forEach(mapping => {
    console.log(`  - ${mapping}`);
  });

  console.log('');
});

// Generate specific verification commands
console.log('🎯 SPECIFIC VERIFICATION COMMANDS:');
console.log('');

mapping.mappings.forEach(sheetMapping => {
  console.log(`// ${sheetMapping.smartsheet_sheet} → ${sheetMapping.odoo_model}`);
  console.log(`Ask Cursor: "In my Odoo system, does the ${sheetMapping.odoo_model} model have these fields?"`);

  const fields = sheetMapping.field_mappings.map(f => f.odoo_field).join(', ');
  console.log(`Fields to check: ${fields}`);
  console.log('');
});

// Generate sample data verification
console.log('📊 SAMPLE DATA VERIFICATION:');
console.log('');
console.log('Ask Cursor to run these queries to see actual data:');
console.log('');

models.forEach(model => {
  console.log(`// Check ${model} data`);
  console.log(`Ask Cursor: "Show me 3 recent records from the ${model} model in my Odoo system"`);
});

console.log('');
console.log('💡 VERIFICATION CHECKLIST:');
console.log('✅ Field exists in Odoo model');
console.log('✅ Field data type matches (Char, Date, Monetary, Many2one, etc.)');
console.log('✅ Field can store the data from Smartsheet column');
console.log('✅ Relationship fields (Many2one) point to correct related models');
console.log('✅ Required fields are properly handled');
