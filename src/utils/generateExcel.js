import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const generateExcel = (headers = [], body = [], fileName = "Report", chapterName = "") => {
  try {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet([]);

    // Add headers
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [headers?.map(header => header.header) || []]
    );

    // Map body data to match header keys
    const data = body.map(row =>
      headers.reduce((acc, cur) => {
        let val = row[cur.key];
        if (val instanceof Date) val = val.toLocaleDateString();
        if (typeof val === "boolean") val = val ? "Yes" : "No";
        return { ...acc, [cur.header]: val ?? "" };
      }, {})
    );

    XLSX.utils.sheet_add_json(worksheet, data, { origin: 'A2', skipHeader: true });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');

    // --- Generate filename like PDF ---
    const now = new Date();
    const newDate = now.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    const time = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    const safeChapterName = chapterName.replace(/[^a-z0-9]/gi, "_") || "All_Chapters";

    const finalFileName = `${fileName}_${safeChapterName}_Report(${newDate}, ${time}).xlsx`;

    // Save the file
    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, finalFileName);

  } catch (error) {
    console.error("Excel generation failed:", error);
  }
};
