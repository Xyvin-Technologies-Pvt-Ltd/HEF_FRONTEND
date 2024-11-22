import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const generateExcel = (headers = [], body = []) => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet([]);
  
    // Ensure headers are available
    XLSX.utils.sheet_add_aoa(worksheet, [headers?.map(header => header.header) || []]);
  
    // Map body data to match header keys
    const data = body.map(row =>
      headers.reduce((acc, cur) => ({ ...acc, [cur.header]: row[cur.key] || '' }), {})
    );
  
    XLSX.utils.sheet_add_json(worksheet, data, { origin: 'A2', skipHeader: true });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
  
    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'report.xlsx');
  };
  