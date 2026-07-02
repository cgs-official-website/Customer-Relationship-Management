import React, { useRef } from 'react';
import { read, utils } from 'xlsx';
import { Upload, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

const LeadImport = ({ onImport, loading }) => {
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const workbook = read(bstr, { type: 'binary' });
        const wsname = workbook.SheetNames[0];
        const ws = workbook.Sheets[wsname];
        const data = utils.sheet_to_json(ws);

        if (data.length === 0) {
          toast.error("No data found in Excel file.");
          return;
        }

        // Map exact column names from the NEET Leads Excel format
        const mappedData = data.map(row => {
          let rawPhone = String(row['Phone Number'] || row.phone_number || row.Phone || row.phone || '');
          // Clean phone: remove +91 prefix, keep only last 10 digits if starts with +91
          let cleanPhone = rawPhone.replace(/^\+91/, '').replace(/^p:/i, '').trim();

          return {
            // Lead identity
            externalId:     row['Id'] || row.id || '',
            createdTime:    row['Created Time'] || row.created_time || '',

            // Person info
            name:           row['Full Name'] || row.full_name || row.Name || row.name || 'Unknown',
            phone:          cleanPhone,
            email:          row['Email'] || row.email || '',
            city:           row['City'] || row.city || '',

            // NEET details
            neetStatus:     row['Neet Status'] || row.neet_status || '',
            neetScore:      row['Neet Score'] || row.neet_score || '',
            hostelRequired: row['Hostel Required'] || row.hostel_required || '',

            // Campaign info
            platform:       row['Platform'] || row.platform || '',
            campaignName:   row['Campaign Name'] || row.campaign_name || '',
            adName:         row['Ad Name'] || row.ad_name || '',
            adsetName:      row['Adset Name'] || row.adset_name || '',
            formName:       row['Form Name'] || row.form_name || '',

            // Source label
            source: row['Platform'] || row.platform ? `${(row['Platform'] || row.platform).toUpperCase()} Ad` : 'Excel Import',
          };
        }).filter(lead => lead.phone !== '' && lead.name !== 'Unknown');

        if (mappedData.length === 0) {
          toast.error("No valid leads found. Ensure 'Phone Number' and 'Full Name' columns exist.");
          return;
        }

        onImport(mappedData);
      } catch (error) {
        console.error("Error parsing Excel:", error);
        toast.error("Failed to parse Excel file: " + error.message);
      }

      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div>
      <input
        type="file"
        accept=".xlsx, .xls, .csv"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileUpload}
      />
      <button
        disabled={loading}
        onClick={() => fileInputRef.current?.click()}
        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
      >
        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
        Import Leads
      </button>
    </div>
  );
};

export default LeadImport;
