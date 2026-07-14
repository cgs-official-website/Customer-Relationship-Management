import React, { useRef, useState } from 'react';
import { read, utils } from 'xlsx';
import { Upload, Loader2, X, FileSpreadsheet } from 'lucide-react';
import { toast } from 'react-toastify';

const LeadImport = ({ onImport, loading }) => {
  const fileInputRef = useRef(null);
  
  const [showModal, setShowModal] = useState(false);
  const [uploadName, setUploadName] = useState('NEET call Tag');
  const [selectedFile, setSelectedFile] = useState(null);

  const resetInput = () => {
    setShowModal(false);
    setUploadName('NEET call Tag');
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const confirmImport = () => {
    if (!uploadName.trim()) {
      toast.error("Please enter an upload name/tag.");
      return;
    }
    if (!selectedFile) {
      toast.error("Please select an Excel file.");
      return;
    }

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

        // Helper to guess a field from row keys
        const guessField = (row, possibleKeys) => {
          const keys = Object.keys(row);
          // 1. Try exact match (case insensitive)
          for (const pk of possibleKeys) {
            const exact = keys.find(k => k.trim().toLowerCase() === pk.toLowerCase());
            if (exact && row[exact] !== undefined) return String(row[exact]);
          }
          // 2. Try partial match
          for (const pk of possibleKeys) {
            const includes = keys.find(k => k.trim().toLowerCase().includes(pk.toLowerCase()));
            if (includes && row[includes] !== undefined) return String(row[includes]);
          }
          return '';
        };

        const mappedData = data.map((row, index) => {
          let rawPhone = guessField(row, ['phone', 'mobile', 'contact', 'number', 'whatsapp', 'ph', 'cell']);
          let cleanPhone = rawPhone.replace(/^\+91/, '').replace(/^p:/i, '').trim();

          let name = guessField(row, ['name', 'student', 'candidate', 'lead', 'customer', 'person']);
          if (!name) name = `Imported Lead ${index + 1}`;

          let email = guessField(row, ['email', 'mail']);
          let city = guessField(row, ['city', 'location', 'town', 'district', 'place']);
          
          let platform = guessField(row, ['platform', 'source', 'medium']);
          let campaign = guessField(row, ['campaign']);

          // Create a summary note of all data so nothing is lost
          let rawDataText = "Imported Excel Data:\n";
          Object.entries(row).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
              rawDataText += `${key}: ${value}\n`;
            }
          });

          return {
            name: name,
            phone: cleanPhone || 'No Phone',
            email: email,
            city: city,
            
            neetStatus: guessField(row, ['neet status', 'status']),
            neetScore: guessField(row, ['score', 'mark', 'neet score']),
            hostelRequired: guessField(row, ['hostel']),
            
            platform: platform,
            campaignName: campaign,
            source: platform ? platform.toUpperCase() : 'Excel Import',
            uploadTag: uploadName.trim(),
            
            notes: [
              {
                text: rawDataText.trim(),
                timestamp: new Date().toISOString()
              }
            ]
          };
        }); // Accept all parsed rows since sheet_to_json skips empty rows

        if (mappedData.length === 0) {
          toast.error("The selected Excel file appears to be empty.");
          return;
        }

        onImport(mappedData);
        resetInput();
      } catch (error) {
        console.error("Error parsing Excel:", error);
        toast.error("Failed to parse Excel file: " + error.message);
      }
    };
    reader.readAsBinaryString(selectedFile);
  };

  return (
    <>
      <button
        disabled={loading}
        onClick={() => setShowModal(true)}
        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
      >
        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
        Import Leads
      </button>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-gray-900 text-lg">Import Leads</h3>
              <button onClick={resetInput} className="text-gray-400 hover:text-gray-600 focus:outline-none">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Upload Name / Tag</label>
                <input
                  type="text"
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  placeholder="e.g. College Data - BDA"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Select Excel File</label>
                <input
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                />
                
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${selectedFile ? 'border-indigo-300 bg-indigo-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400'}`}
                >
                  <FileSpreadsheet className={`w-8 h-8 mb-2 ${selectedFile ? 'text-indigo-600' : 'text-gray-400'}`} />
                  {selectedFile ? (
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-indigo-900">{selectedFile.name}</p>
                      <p className="text-xs text-indigo-600 font-medium">Ready to import</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-gray-700">Click to upload file</p>
                      <p className="text-xs text-gray-500 font-medium">XLSX, XLS, or CSV</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-5 py-4 border-t border-gray-100 bg-gray-50/50">
              <button onClick={resetInput} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button 
                onClick={confirmImport} 
                disabled={!uploadName.trim() || !selectedFile}
                className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Start Import
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LeadImport;
