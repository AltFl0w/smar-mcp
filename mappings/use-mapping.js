// Example script showing how to use the direct-field-mapping.json file
import fs from 'fs';

// Load the mapping file
const mappingData = JSON.parse(fs.readFileSync('./direct-field-mapping.json', 'utf8'));

console.log('📋 Direct Field Mapping Usage Examples\n');

// Example 1: Get Odoo field for a SmartSheet column
function getOdooField(sheetType, columnName) {
  const column = mappingData.mappings[sheetType]?.columns[columnName];
  if (!column) {
    return null;
  }
  return {
    odooField: column.odoo_field,
    model: column.model,
    type: column.type,
    required: column.required || false,
    calculated: column.calculated || false,
    relationship: column.relationship || null
  };
}

// Example 2: Get all columns for a sheet type
function getAllColumns(sheetType) {
  return Object.keys(mappingData.mappings[sheetType]?.columns || {});
}

// Example 3: Get calculated fields only
function getCalculatedFields(sheetType) {
  const columns = mappingData.mappings[sheetType]?.columns || {};
  return Object.entries(columns)
    .filter(([_, config]) => config.calculated)
    .map(([columnName, config]) => ({
      column: columnName,
      odooField: config.odoo_field,
      type: config.type,
      description: config.description
    }));
}

// Example 4: Get relationship fields
function getRelationshipFields(sheetType) {
  const columns = mappingData.mappings[sheetType]?.columns || {};
  return Object.entries(columns)
    .filter(([_, config]) => config.relationship)
    .map(([columnName, config]) => ({
      column: columnName,
      relationship: config.relationship,
      targetModel: config.model,
      description: config.description
    }));
}

// Demonstration
console.log('1. Get Odoo field mapping for "Customer" in CRM pipeline:');
console.log(JSON.stringify(getOdooField('crm_pipeline', 'Customer'), null, 2));

console.log('\n2. Get Odoo field mapping for "Payment Amount" in customer payments:');
console.log(JSON.stringify(getOdooField('customer_payments', 'Payment Amount'), null, 2));

console.log('\n3. All columns in CRM pipeline sheet:');
console.log(getAllColumns('crm_pipeline'));

console.log('\n4. Calculated fields in customer payments:');
console.log(JSON.stringify(getCalculatedFields('customer_payments'), null, 2));

console.log('\n5. Relationship fields in CRM pipeline:');
console.log(JSON.stringify(getRelationshipFields('crm_pipeline'), null, 2));

// Example Odoo query construction
console.log('\n6. Example Odoo query construction:');
function buildOdooQuery(sheetType, smartsheetRow) {
  const query = {
    model: mappingData.mappings[sheetType].primary_model,
    fields: [],
    domain: []
  };

  // Add fields to fetch
  Object.entries(smartsheetRow).forEach(([columnName, value]) => {
    const mapping = getOdooField(sheetType, columnName);
    if (mapping && mapping.odooField) {
      query.fields.push(mapping.odooField);
      if (mapping.required && value) {
        query.domain.push([mapping.odooField, '=', value]);
      }
    }
  });

  return query;
}

// Example usage with sample data
const sampleRow = {
  'Opportunity': '101 Smoke Shop - Freeport, FL - Exterior',
  'Customer': '101 Smoke Shop - Freeport, FL',
  'Expected Revenue': 5000
};

console.log('Sample row:', sampleRow);
console.log('Generated Odoo query:', JSON.stringify(buildOdooQuery('crm_pipeline', sampleRow), null, 2));
