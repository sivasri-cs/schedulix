import jsPDF from 'jspdf';

export function exportToPDF(title, data, metrics) {
  const doc = new jsPDF();
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('OSNova Simulation Report', 20, 20);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Algorithm: ${title}`, 20, 35);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 42);
  doc.line(20, 47, 190, 47);
  let y = 55;
  if (metrics) {
    doc.setFont('helvetica', 'bold');
    doc.text('Metrics:', 20, y); y += 8;
    doc.setFont('helvetica', 'normal');
    Object.entries(metrics).forEach(([key, val]) => {
      doc.text(`${key}: ${val}`, 25, y); y += 7;
    });
    y += 5;
  }
  if (data && data.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.text('Results:', 20, y); y += 8;
    doc.setFont('helvetica', 'normal');
    const headers = Object.keys(data[0]);
    const colWidth = 170 / headers.length;
    doc.setFontSize(9);
    headers.forEach((h, i) => doc.text(h, 20 + i * colWidth, y));
    y += 6; doc.line(20, y, 190, y); y += 4;
    data.forEach(row => {
      if (y > 270) { doc.addPage(); y = 20; }
      headers.forEach((h, i) => doc.text(String(row[h] ?? ''), 20 + i * colWidth, y));
      y += 6;
    });
  }
  doc.save(`osnova_${title.replace(/\s+/g, '_')}_report.pdf`);
}
