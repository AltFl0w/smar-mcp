import { SmartsheetAPI } from './build/apis/smartsheet-api.js';
import { config } from 'dotenv';
import { writeFileSync } from 'fs';

config();

async function fetchAdditionalSheets() {
  const api = new SmartsheetAPI(process.env.SMARTSHEET_API_KEY, process.env.SMARTSHEET_ENDPOINT);

  // Extract sheet IDs from URLs
  const additionalSheets = [
    {
      id: 'Xq5JGMgHPC5qvQhWv99WWRh49wfJw3q52Jhp7hx1',
      name: 'Odoo_Report_1',
      url: 'https://app.smartsheet.com/sheets/Xq5JGMgHPC5qvQhWv99WWRh49wfJw3q52Jhp7hx1?view=grid'
    },
    {
      id: 'PPgFxc26P9Qgv4hV56r36HgP4V5WcPx7XXrQ8f41',
      name: 'Odoo_Report_2',
      url: 'https://app.smartsheet.com/sheets/PPgFxc26P9Qgv4hV56r36HgP4V5WcPx7XXrQ8f41?view=grid'
    }
  ];

  for (const sheet of additionalSheets) {
    try {
      console.log(`\n=== FETCHING SHEET: ${sheet.name} (${sheet.id}) ===`);

      // Get basic sheet info first
      const sheetData = await api.sheets.getSheet(sheet.id, null, null, 5, 1); // Get first 5 rows

      console.log(`Sheet Name: ${sheetData.name}`);
      console.log(`Total Rows: ${sheetData.totalRowCount}`);
      console.log(`Columns: ${sheetData.columns.length}`);

      // Create a simplified version for the clone
      const cloneData = {
        sourceUrl: sheet.url,
        originalSheetId: sheet.id,
        originalSheetName: sheetData.name,
        totalRowsInOriginal: sheetData.totalRowCount,
        clonedRows: 5,
        columns: sheetData.columns.map(col => ({
          id: col.id,
          title: col.title,
          type: col.type,
          index: col.index
        })),
        rows: sheetData.rows.slice(0, 5).map(row => ({
          id: row.id,
          rowNumber: row.rowNumber,
          cells: row.cells.map((cell, cellIndex) => {
            const column = sheetData.columns[cellIndex];
            return {
              columnId: column.id,
              columnTitle: column.title,
              value: cell.value,
              displayValue: cell.displayValue,
              formula: cell.formula,
              format: cell.format
            };
          })
        }))
      };

      // Save to file
      const filename = `data examples/${sheet.name}_First_5_Rows.json`;
      writeFileSync(filename, JSON.stringify(cloneData, null, 2));
      console.log(`✅ Saved clone to: ${filename}`);

      // Show column headers
      console.log('\nColumns:');
      sheetData.columns.forEach((col, i) => {
        console.log(`  ${i + 1}. ${col.title} (${col.type})`);
      });

      // Show first 5 rows
      console.log('\nFirst 5 Rows:');
      if (sheetData.rows && sheetData.rows.length > 0) {
        sheetData.rows.slice(0, 5).forEach((row, i) => {
          console.log(`Row ${i + 1}:`);
          row.cells.forEach((cell, cellIndex) => {
            const column = sheetData.columns[cellIndex];
            if (column) {
              console.log(`  ${column.title}: ${cell.value || '(empty)'}`);
            }
          });
          console.log('');
        });
      } else {
        console.log('No rows found in this sheet.');
      }

    } catch (error) {
      console.error(`Error accessing sheet ${sheet.id}:`, error.message);
      if (error.response) {
        console.error('API Response:', error.response.data);
      }
    }
  }
}

fetchAdditionalSheets().catch(console.error);
