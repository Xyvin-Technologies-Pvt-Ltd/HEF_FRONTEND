import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../assets/images/logo.png"; // imported once

export const generatePDF = (headers = [], body = [], fileName = "Report", eventInfo = null) => {
  try {
    if (!headers || headers.length === 0) throw new Error("Headers are required");
    if (!body || !Array.isArray(body)) throw new Error("Body data must be an array");

    const doc = new jsPDF({ unit: "pt", format: "a4", orientation: "portrait" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const headerHeight = 90;

    // --- Prepare table data ---
    const charWidth = 7;
    const bodyData = body.map(row =>
      headers.map(h => {
        const key = typeof h === "string" ? h : h.key;
        const val = row[key] ?? "";
        if (typeof val === "boolean") return val ? "Yes" : "No";
        if (val instanceof Date) return val.toLocaleDateString();
        return String(val);
      })
    );

    const tableHeaders = headers.map(h => (typeof h === "string" ? h : h.header || "Unknown"));

    // --- Calculate dynamic column widths ---
    let colWidths = tableHeaders.map((header, i) => {
      let maxChars = header.length;
      bodyData.forEach(row => { if (row[i]) maxChars = Math.max(maxChars, row[i].length); });
      return maxChars * charWidth + 15;
    });
    const maxColWidth = 120;
    colWidths = colWidths.map(w => Math.min(w, maxColWidth));
    const availableWidth = pageWidth - margin * 2;
    const totalWidth = colWidths.reduce((a, b) => a + b, 0);
    const scale = totalWidth > availableWidth ? availableWidth / totalWidth : 1;
    colWidths = colWidths.map(w => w * scale);

    // --- AutoTable ---
    autoTable(doc, {
      head: [tableHeaders],
      body: bodyData,
      startY: headerHeight + 30, // ⬅ shifted down to leave space for generated date
      columnStyles: Object.fromEntries(colWidths.map((w, i) => [i, { cellWidth: w }])),
      styles: {
        fontSize: 7,
        cellPadding: 3,
        overflow: "linebreak",
        halign: "center",
        valign: "middle",
        textColor: [60, 60, 60],
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: "bold",
        halign: "center",
        valign: "middle",
        lineWidth: 0.5,
        minCellHeight: 10,
      },
      alternateRowStyles: { fillColor: [250, 251, 252] },
      tableWidth: "auto",
      pageBreak: "auto",

      didDrawPage: (data) => {
        // --- Gradient header ---
        const gradSteps = 100;
        for (let i = 0; i <= gradSteps; i++) {
          const r = 41 + Math.round((70 - 41) * (i / gradSteps));
          const g = 128 + Math.round((150 - 128) * (i / gradSteps));
          const b = 185 + Math.round((200 - 185) * (i / gradSteps));
          doc.setFillColor(r, g, b);
          doc.rect(0, (i * headerHeight) / gradSteps, pageWidth, headerHeight / gradSteps, "F");
        }

        // --- Header content ---
        const centerY = headerHeight / 2 + 5;
        const logoWidth = 50;
        const logoHeight = 50;
        const logoX = margin;
        const logoY = centerY - logoHeight / 2;
        doc.addImage(logo, "PNG", logoX, logoY, logoWidth, logoHeight);

        let textY = centerY - 10;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.setTextColor(255);
        doc.text("HEF ORGANIZATION", pageWidth / 2, textY, { align: "center" });

        textY += 18;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.text(fileName.replace(/_/g, " ").toUpperCase(), pageWidth / 2, textY, { align: "center" });

        if (eventInfo) {
          textY += 16;
          doc.setFont("helvetica", "bold");
          doc.setFontSize(11);
          doc.setTextColor(255);
          doc.text(eventInfo.eventName, pageWidth / 2, textY, { align: "center" });

          textY += 14;
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          doc.text(eventInfo.eventDateTime, pageWidth / 2, textY, { align: "center" });
        }
        // --- Report Generated Date (only on first page, right side below header) ---
        if (data.pageNumber === 1) {
          const now = new Date();
          const reportDate = now.toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          });

          doc.setFont("helvetica", "normal"); // plain text
          doc.setFontSize(10);
          doc.setTextColor(255, 165, 0); // orange color
          doc.text(
            `Report Generated On: ${reportDate}`,
            pageWidth - margin, // align near the right margin
            headerHeight + 15,
            { align: "right" } // right-align the text
          );
        }



        // --- Footer ---
        doc.setDrawColor(200);
        doc.setLineWidth(0.5);
        doc.line(margin, pageHeight - 25, pageWidth - margin, pageHeight - 25);

        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(6);
        doc.setTextColor(120);
        doc.text(`Page ${data.pageNumber} of ${pageCount}`, pageWidth / 2, pageHeight - 20, { align: "center" });
        doc.setTextColor(150);
        doc.text("HEF Organization - Member Management System", pageWidth / 2, pageHeight - 10, { align: "center" });
      },
    });

    // --- Save PDF ---
    const now = new Date();
    const newDate = now.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    const time = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    doc.save(`${fileName}_Report(${newDate}, ${time}).pdf`);

  } catch (error) {
    console.error("PDF generation failed:", error);
  }
};
