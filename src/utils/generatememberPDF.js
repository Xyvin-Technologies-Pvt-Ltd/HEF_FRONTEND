import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logo from "../assets/images/logo.png";

export const generateMemberPDF = (headers = [], body = [], fileName, chapterName = "All Chapters") => {
  try {
    console.log('generatePDF called with:', { headers, body: body?.length, fileName });

    const doc = new jsPDF();

    // Set page dimensions and margins
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = { top: 15, right: 12, bottom: 25, left: 12 }; // Reduced margins
    const contentWidth = pageWidth - margin.left - margin.right;

    // Add company header with logo placeholder
    doc.setFillColor(41, 128, 185);
    doc.rect(0, 0, pageWidth, 20, 'F'); // Reduced height from 28


    // Add logo on the left of blue header
    const logoWidth = 15; // width of logo in mm
    const logoHeight = 15; // height of logo in mm
    const logoX = 10; // X position from left
    const logoY = 2;  // Y position from top
    doc.addImage(logo, 'PNG', logoX, logoY, logoWidth, logoHeight);

    // Set heading color and font again after logo
    doc.setTextColor(255, 255, 255); // white color
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('HEF Organization', pageWidth / 2, 10, { align: 'center' });

    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text('Member Management System', pageWidth / 2, 17, { align: 'center' });


    // Keep date variables for filename but don't display them
    const date = new Date();
    const newDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const time = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    // Validate inputs
    if (!headers || !Array.isArray(headers) || headers.length === 0) {
      console.error('Invalid headers provided to generatePDF:', headers);
      throw new Error('Invalid headers data');
    }

    if (!body || !Array.isArray(body)) {
      console.error('Invalid body provided to generatePDF:', body);
      throw new Error('Invalid body data');
    }

    console.log('Headers structure:', headers.map(h => ({
      type: typeof h,
      isObject: h && typeof h === 'object',
      header: h?.header,
      key: h?.key
    })));

    // Prepare table data with only essential columns
    const tableHeaders = headers.map(header => {
      if (typeof header === 'string') return header;
      if (header && typeof header === 'object' && header.header) return header.header;
      return 'Unknown';
    });

    // Filter headers to only include columns that actually exist in the data
    const selectedColumnIndices = [0, 1, 2, 3, 4, 5]; // Member ID, Name, Phone, Email, Chapter Name, Date of Join
    const filteredHeaders = selectedColumnIndices.map(index => tableHeaders[index]).filter(Boolean);

    console.log('Processed table headers:', filteredHeaders);

    const tableData = body.map((row, rowIndex) => {
      return selectedColumnIndices.map((colIndex) => {
        try {
          const header = headers[colIndex];
          let key = header;
          if (header && typeof header === 'object' && header.key) {
            key = header.key;
          }

          const value = row[key];
          // Handle different data types and format them properly
          if (value === null || value === undefined) return '';
          if (typeof value === 'string') return value;
          if (typeof value === 'number') return value.toString();
          if (typeof value === 'boolean') return value ? 'Yes' : 'No';
          if (value instanceof Date) return value.toLocaleDateString();
          return String(value);
        } catch (error) {
          console.error(`Error processing cell data at row ${rowIndex}, col ${colIndex}:`, error);
          return '';
        }
      });
    });

    console.log('Processed table data sample:', tableData.slice(0, 2));

    // Create professional table with scaled sizing and alignment
    try {
      doc.autoTable({
        head: [filteredHeaders],
        body: tableData,
        startY: 25, // Reduced from 72 to minimize white space
        styles: {
          fontSize: 5, // Further reduced from 6
          cellPadding: 1, // Further reduced from 2
          lineColor: [220, 220, 220],
          lineWidth: 0.3,
          textColor: [60, 60, 60],
          font: 'helvetica',
          cellMinHeight: 5, // Further reduced from 6
          overflow: 'linebreak',
          halign: 'left',
          valign: 'middle',
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold',
          fontSize: 6, // Further reduced from 7
          halign: 'center',
          valign: 'middle',
          lineWidth: 0.5,
          lineColor: [255, 255, 255],
          cellPadding: 1, // Further reduced from 2
          cellMinHeight: 6, // Further reduced from 8
        },
        bodyStyles: {
          fontSize: 5, // Further reduced from 6
          lineWidth: 0.2,
          lineColor: [240, 240, 240],
          cellPadding: 1, // Further reduced from 2
          cellMinHeight: 5, // Further reduced from 6
          overflow: 'linebreak',
          valign: 'middle',
          halign: 'center',
        },
        alternateRowStyles: {
          fillColor: [250, 251, 252],
        },
        // Optimized column widths for proper right-side alignment
        // Total width: 35+25+20+35+30+20 = 165 (better alignment with header)
        columnStyles: {
          0: {
            cellWidth: 35, // Member ID - reduced for better alignment
            halign: 'left',
            fontStyle: 'bold',
            textColor: [41, 128, 185],
            cellPadding: 2,
            fontSize: 6
          }, // Member ID
          1: {
            cellWidth: 25, // Name - reduced for better alignment
            halign: 'left',
            fontStyle: 'bold',
            textColor: [60, 60, 60],
            cellPadding: 2,
            fontSize: 6
          }, // Name
          2: {
            cellWidth: 20, // Phone - reduced for better alignment
            halign: 'center',
            textColor: [70, 70, 70],
            cellPadding: 2,
            fontSize: 5
          }, // Phone
          3: {
            cellWidth: 35, // Email - reduced for better alignment
            halign: 'left',
            textColor: [70, 70, 70],
            cellPadding: 2,
            fontSize: 5
          }, // Email
          4: {
            cellWidth: 30, // Chapter Name - reduced for better alignment
            halign: 'left',
            textColor: [80, 80, 80],
            cellPadding: 2,
            fontSize: 5
          }, // Chapter Name
          5: {
            cellWidth: 30, // Date of Join - reduced for better alignment
            minCellWidth: 30,
            halign: 'center',
            textColor: [70, 70, 70],
            cellPadding: 2,
            fontSize: 5
          }, // Date of Join
        },

        margin: {
          top: 87, // Adjusted from 105
          right: margin.right,
          bottom: 35, // Reduced from 40
          left: margin.left
        },
        tableWidth: contentWidth,
        showFoot: 'lastPage',
        showHead: 'firstPage',
        pageBreak: 'auto',
        rowPageBreak: 'auto',
        didDrawPage: function (data) {

          if (data.pageNumber === 1) {
            const now = new Date();
            const reportDate = now.toLocaleString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            });

            doc.setFont("helvetica", "normal"); // plain font
            doc.setFontSize(8); // small text
            doc.setTextColor(255, 165, 0); // orange
            doc.text(
              `Report Generated On: ${reportDate}`,
              pageWidth - margin.right,
              40, // 👈 just under blue header
              { align: "right" }
            );
          }


          // Add page number with enhanced styling
          const pageCount = doc.internal.getNumberOfPages();
          doc.setFontSize(7); // Reduced from 9
          doc.setTextColor(120, 120, 120);
          doc.setFont('helvetica', 'normal');

          // Page number background
          const pageNumWidth = 25; // Reduced from 30
          const pageNumX = (pageWidth - pageNumWidth) / 2;
          doc.setFillColor(248, 249, 250);
          doc.roundedRect(pageNumX, pageHeight - 20, pageNumWidth, 12, 2, 2, 'F'); // Reduced height

          // Page number text
          doc.setTextColor(100, 100, 100);
          doc.text(
            `Page ${data.pageNumber} of ${pageCount}`,
            pageWidth / 2,
            pageHeight - 14, // Adjusted Y position
            { align: 'center' }
          );

          // Footer line with gradient effect
          doc.setDrawColor(200, 200, 200);
          doc.setLineWidth(0.5);
          doc.line(
            margin.left,
            pageHeight - 25, // Adjusted from 30
            pageWidth - margin.right,
            pageHeight - 25
          );

          // Company footer
          doc.setFontSize(6); // Reduced from 8
          doc.setTextColor(150, 150, 150);
          doc.text(
            'HEF Organization - Member Management System',
            pageWidth / 2,
            pageHeight - 8, // Adjusted from 10
            { align: 'center' }
          );
        },
        didParseCell: function (data) {
          // Enhanced cell styling
          if (data.row.index === 0) {
            // Header row
            data.cell.styles.lineWidth = 0.5;
            data.cell.styles.lineColor = [255, 255, 255];
          } else {
            // Body rows
            data.cell.styles.lineWidth = 0.2;
            data.cell.styles.lineColor = [240, 240, 240];
          }

          // Add subtle borders
          if (data.column.index === 0) {
            data.cell.styles.lineWidth = 0.3;
            data.cell.styles.lineColor = [41, 128, 185];
          }
        },
        willDrawCell: function (data) {
          // Custom cell content formatting - removed since we don't have status column
          // No special styling needed for the simplified table

          // Handle text overflow for all columns with optimized truncation
          if (data.cell.text && data.cell.text.length > 0) {
            const text = data.cell.text[0];
            let maxLength = 12; // Default truncation

            // Adjust truncation based on column type and width
            if (data.column.index === 0) { // Member ID
              maxLength = 28; // Adjusted for reduced column width
            } else if (data.column.index === 1) { // Name
              maxLength = 20; // Adjusted for reduced column width
            } else if (data.column.index === 2) { // Phone
              maxLength = 15; // Adjusted for reduced column width
            } else if (data.column.index === 3) { // Email
              maxLength = 28; // Adjusted for reduced column width
            } else if (data.column.index === 4) { // Chapter Name
              maxLength = 22; // Adjusted for reduced column width
            } else if (data.column.index === 5) { // Date of Join
              maxLength = 12; // Adjusted for reduced column width
            }

            if (text && text.length > maxLength) {
              // Truncate long text and add ellipsis
              data.cell.text[0] = text.substring(0, maxLength) + '...';
            }
          }
        },
      });
    } catch (autoTableError) {
      console.error('autoTable failed, creating enhanced manual table:', autoTableError);

      // Enhanced fallback: Create a professional manual table with minimal spacing
      let currentY = 25; // Reduced from 72 to minimize white space

      // Draw enhanced headers with better styling
      doc.setFontSize(8); // Reduced from 9
      doc.setFont('helvetica', 'bold');
      doc.setFillColor(41, 128, 185);
      doc.roundedRect(margin.left, currentY - 2, contentWidth, 8, 2, 2, 'F'); // Reduced height

      // Header text with proper alignment - optimized for right-side alignment
      let currentX = margin.left;
      const colWidths = [35, 25, 20, 35, 30, 20]; // Optimized widths for better right-side alignment

      filteredHeaders.forEach((header, index) => {
        const colWidth = colWidths[index] || 20; // Optimized default
        doc.setTextColor(255, 255, 255);

        // Center align header text
        const textWidth = doc.getTextWidth(header);
        const textX = currentX + (colWidth - textWidth) / 2;
        doc.text(header, textX, currentY + 2); // Adjusted Y position

        currentX += colWidth;
      });

      currentY += 8; // Reduced spacing

      // Draw enhanced data rows
      doc.setFontSize(5); // Further reduced from 6
      doc.setFont('helvetica', 'normal');

      tableData.forEach((row, rowIndex) => {
        if (currentY > pageHeight - 45) { // Further adjusted from 50
          doc.addPage();
          currentY = 12; // Further reduced from 15
        }

        currentX = margin.left;
        row.forEach((cell, colIndex) => {
          const colWidth = colWidths[colIndex] || 16; // Updated to match new widths
          const cellValue = String(cell || '');

          // Alternating row colors
          const fillColor = rowIndex % 2 === 0 ? [255, 255, 255] : [250, 251, 252];
          doc.setFillColor(...fillColor);
          doc.roundedRect(currentX, currentY - 1, colWidth, 5, 1, 1, 'F'); // Further reduced height

          // Cell borders
          doc.setDrawColor(240, 240, 240);
          doc.setLineWidth(0.2);
          doc.rect(currentX, currentY - 1, colWidth, 5);

          // Text alignment and styling
          doc.setTextColor(60, 60, 60);

          if (colIndex === 0) {
            // Member ID column - left aligned, bold
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(41, 128, 185);
            doc.text(cellValue, currentX + 1, currentY + 1);
          } else if (colIndex === 1) {
            // Name column - left aligned, bold
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(60, 60, 60);
            doc.text(cellValue, currentX + 1, currentY + 1);
          } else if (colIndex === 2) {
            // Phone column - center aligned
            doc.setFont('helvetica', 'normal');
            const textWidth = doc.getTextWidth(cellValue);
            const textX = currentX + (colWidth - textWidth) / 2;
            doc.text(cellValue, textX, currentY + 1);
          } else if (colIndex === 3) {
            // Email column - left aligned
            doc.setFont('helvetica', 'normal');
            doc.text(cellValue, currentX + 1, currentY + 1);
          } else if (colIndex === 4) {
            // Chapter Name column - left aligned
            doc.setFont('helvetica', 'normal');
            doc.text(cellValue, currentX + 1, currentY + 1);
          } else if (colIndex === 5) {
            // Date of Join column - center aligned
            doc.setFont('helvetica', 'normal');
            const textWidth = doc.getTextWidth(cellValue);
            const textX = currentX + (colWidth - textWidth) / 2;
            doc.text(cellValue, textX, currentY + 1);
          } else {
            // Default fallback - center aligned
            doc.setFont('helvetica', 'normal');
            const textWidth = doc.getTextWidth(cellValue);
            const textX = currentX + (colWidth - textWidth) / 2;
            doc.text(cellValue, textX, currentY + 1);
          }

          currentX += colWidth;
        });
        currentY += 5; // Further reduced spacing
      });
    }

    // Save the PDF
    const safeChapterName = (chapterName || "All Chapters").replace(/[^a-z0-9]/gi, "_");
    doc.save(`${fileName}_Report(${chapterName},${newDate},${time}).pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error(`PDF generation failed: ${error.message}`);
  }
};
