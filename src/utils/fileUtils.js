// src/utils/fileUtils.js
import * as XLSX from 'xlsx';
import { jsPDF } from "jspdf";

export const convertToCSV = (enquiry) => {
  const headers = [
    "ID",
    "Customer Name",
    "Project/Vehicle Program",
    "Part Code",
    "Part Name",
    "Raw Material",
    "SOP Date",
    "Part Colour",
    "Annual Volume",
    "Part Cost (₹)",
    "Tool Cost (₹)",
    "Annual Business Potential (Lac)",
    "P.O. No.",
    "Customer PO Date",
  ];

  const values = [
    enquiry.id,
    enquiry.customerName,
    enquiry.projectVehicleProgram,
    enquiry.partCode,
    enquiry.partName,
    enquiry.rawMaterial,
    new Date(enquiry.sop).toLocaleDateString(),
    enquiry.partColour,
    enquiry.estimatedAnnualVolume,
    enquiry.partCostEstimate,
    enquiry.toolCostEstimate,
    enquiry.annualBusinessPotential,
    enquiry.poNo || "-",
    new Date(enquiry.customerPODate).toLocaleDateString(),
  ];

  const csvContent = [headers, values].map(e => e.join(",")).join("\n");
  return csvContent;
};

export const downloadCSV = (enquiry) => {
  if (!enquiry) return; // Ensure enquiry is not null
  const csvContent = convertToCSV(enquiry);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `enquiry_${enquiry.id}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const downloadExcel = (enquiry) => {
  if (!enquiry) return; // Ensure enquiry is not null
  const worksheet = XLSX.utils.json_to_sheet([{
    ID: enquiry.id,
    "Customer Name": enquiry.customerName,
    "Project/Vehicle Program": enquiry.projectVehicleProgram,
    "Part Code": enquiry.partCode,
    "Part Name": enquiry.partName,
    "Raw Material": enquiry.rawMaterial,
    "SOP Date": new Date(enquiry.sop).toLocaleDateString(),
    "Part Colour": enquiry.partColour,
    "Annual Volume": enquiry.estimatedAnnualVolume,
    "Part Cost (₹)": enquiry.partCostEstimate,
    "Tool Cost (₹)": enquiry.toolCostEstimate,
    "Annual Business Potential (Lac)": enquiry.annualBusinessPotential,
    "P.O. No.": enquiry.poNo || "-",
    "Customer PO Date": new Date(enquiry.customerPODate).toLocaleDateString(),
  }]);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Enquiry");
  XLSX.writeFile(workbook, `enquiry_${enquiry.id}.xlsx`);
};

export const downloadPDF = (enquiry) => {
  const doc = new jsPDF();
  doc.text("Enquiry Details", 10, 10);
  doc.text(`ID: ${enquiry.id}`, 10, 20);
  doc.text(`Customer Name: ${enquiry.customerName}`, 10, 30);
  doc.text(`Project/Vehicle Program: ${enquiry.projectVehicleProgram}`, 10, 40);
  doc.text(`Part Code: ${enquiry.partCode}`, 10, 50);
  doc.text(`Part Name: ${enquiry.partName}`, 10, 60);
  doc.text(`Raw Material: ${enquiry.rawMaterial}`, 10, 70);
  doc.text(`SOP Date: ${new Date(enquiry.sop).toLocaleDateString()}`, 10, 80);
  doc.text(`Part Colour: ${enquiry.partColour}`, 10, 90);
  doc.text(`Annual Volume: ${enquiry.estimatedAnnualVolume}`, 10, 100);
  doc.text(`Part Cost: ₹${enquiry.partCostEstimate}`, 10, 110);
  doc.text(`Tool Cost: ₹${enquiry.toolCostEstimate}`, 10, 120);
  doc.text(`Annual Business Potential: ${enquiry.annualBusinessPotential} Lac`, 10, 130);
  doc.text(`P.O. No.: ${enquiry.poNo || "-"}`, 10, 140);
  doc.text(`Customer PO Date: ${new Date(enquiry.customerPODate).toLocaleDateString()}`, 10, 150);

  doc.save(`enquiry_${enquiry.id}.pdf`);
};