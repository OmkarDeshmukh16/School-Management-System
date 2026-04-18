import * as XLSX from 'xlsx';

export const downloadScholarTemplate = () => {

    const headers = [[
        "generalRegisterNo",
        "penNumber",
        "uid",
        "Name",
        "Roll Number",
        "Current Class",
        "Email",
        "Gender",
        "Password",
        "Date of birth",
        "birthDateInWords",
        "Nationality",
        "Mother's Name",
        "Mother Tongue",
        "Religion",
        "Caste",
        "Sub caste",
        "Birth Place",
        "Mob no.",
        "Address",
        "Admission Date",
        "Previous School Name",
        "Previous School Standard",
        "Village",
        "Taluka",
        "District"

    ]];

    // Create a new workbook and worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(headers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Scholar Enrollment");

    // Adjust column widths for better readability
    const wscols = headers[0].map(() => ({ wch: 20 }));
    worksheet['!cols'] = wscols;

    // Trigger the download
    XLSX.writeFile(workbook, "Institutional_Enrollment_Template.xlsx");
};