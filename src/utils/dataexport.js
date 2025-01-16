import * as XLSX from "xlsx";

const exportToExcel = (formattedData = [], filename, widths = []) => {
  // Convert formatted data to worksheet
  const worksheet = XLSX.utils.json_to_sheet(formattedData);

  worksheet["!cols"] = widths;

  // Apply column widths

  // Apply column font styling
  Object.keys(worksheet).forEach((cell) => {
    if (!cell.startsWith("!")) {
      worksheet[cell].s = {
        font: { bold: true, sz: 10 }, // Bold text, size 10
      };
    }
  });

  // Create a new workbook and append the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Write to Excel file
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

export default exportToExcel;
