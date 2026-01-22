/**
 * Extract product variation data from Dewater.xlsx
 * Run with: npx tsx scripts/extract-excel-data.ts
 */

import * as XLSX from 'xlsx';
import { join } from 'path';

const xlsxPath = join(process.cwd(), '.planning/archive/Dewater.xlsx');

console.log('Reading Excel file:', xlsxPath);

const workbook = XLSX.readFile(xlsxPath);

console.log('\nSheet names:', workbook.SheetNames);

for (const sheetName of workbook.SheetNames) {
  console.log('\n' + '='.repeat(60));
  console.log('Sheet: ' + sheetName);
  console.log('='.repeat(60));

  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  // Show first 30 rows
  for (let i = 0; i < Math.min(30, data.length); i++) {
    const row = data[i] as unknown[];
    if (row && row.length > 0) {
      console.log('Row ' + i + ': ' + JSON.stringify(row).slice(0, 200));
    }
  }

  console.log('... Total rows: ' + data.length);
}
