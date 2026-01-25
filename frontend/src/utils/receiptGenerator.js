import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateReceipt = (student, transaction) => {
    const doc = new jsPDF();
    
    // Classic Institutional Header
    doc.setFont("times", "bold");
    doc.setFontSize(22);
    doc.text("INSTITUTIONAL FEE RECEIPT", 105, 30, { align: "center" });
    
    doc.setFontSize(12);
    doc.setFont("times", "normal");
    doc.text(`Receipt No: ${transaction.receiptNo}`, 20, 50);
    doc.text(`Date: ${new Date(transaction.date).toLocaleDateString()}`, 150, 50);

    // Scholar Details
    autoTable(doc, {
        startY: 60,
        theme: 'plain',
        body: [
            ["Scholar Name:", student.name],
            ["Roll Number:", student.rollNum],
            ["Class:", student.sclassName?.sclassName || "N/A"],
            ["Payment Method:", transaction.paymentMethod]
        ],
        styles: { font: "times", fontSize: 11 }
    });

    // Financial Table
    autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 10,
        head: [['Description', 'Amount (INR)']],
        body: [['Tuition Fee Installment', `INR ${transaction.amount}`]],
        headStyles: { fillColor: [26, 26, 26] },
        styles: { font: "times" }
    });

    const finalY = doc.lastAutoTable.finalY;
    doc.text("Authorized Signatory", 150, finalY + 30);
    doc.save(`Receipt_${student.rollNum}_${transaction.receiptNo}.pdf`);
};