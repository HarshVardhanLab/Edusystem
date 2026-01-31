import { useState, useEffect } from 'react';
import { qrService } from '../../services/qrService';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faQrcode, faCalendar, faDownload, faPrint, faRefresh
} from '@fortawesome/free-solid-svg-icons';
import { QRCodeSVG } from 'qrcode.react';
import { format } from 'date-fns';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const QRCodeManagement = () => {
  const [qrCodes, setQrCodes] = useState([]);
  const [todayQR, setTodayQR] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchQRCodes();
  }, []);

  const fetchQRCodes = async () => {
    try {
      const response = await qrService.getQRCodes();
      const codes = response.data.results || response.data;
      setQrCodes(codes);
      
      // Find today's QR code
      const today = new Date().toISOString().split('T')[0];
      const todayCode = codes.find(qr => qr.date === today);
      setTodayQR(todayCode);
    } catch (error) {
      console.error('Error fetching QR codes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQR = async () => {
    setGenerating(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await qrService.generateQRCode(today);
      toast.success('QR Code generated successfully!');
      setTodayQR(response.data.qr_code);
      fetchQRCodes();
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to generate QR code';
      toast.error(errorMsg);
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadQR = () => {
    if (!todayQR) {
      toast.error('No QR code to download');
      return;
    }

    try {
      // Get the SVG element
      const svg = document.querySelector('#qr-code-svg');
      if (!svg) {
        toast.error('QR code not found');
        return;
      }

      // Get SVG data
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      // Set canvas size (add padding)
      canvas.width = 350;
      canvas.height = 350;

      img.onload = () => {
        // Fill white background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw image centered
        ctx.drawImage(img, 25, 25, 300, 300);
        
        // Convert to PNG and download
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = `attendance-qr-${format(new Date(), 'yyyy-MM-dd')}.png`;
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
          toast.success('QR code downloaded successfully!');
        });
      };

      img.onerror = () => {
        toast.error('Failed to download QR code');
      };

      // Load SVG into image
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    } catch (error) {
      console.error('Error downloading QR code:', error);
      toast.error('Failed to download QR code');
    }
  };

  const handlePrintQR = () => {
    window.print();
  };

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">QR Code Management 📱</h1>
        <p className="text-purple-100">Generate and manage attendance QR codes</p>
      </div>

      {/* Today's QR Code */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Today's QR Code</h2>
          {!todayQR && (
            <button
              onClick={handleGenerateQR}
              disabled={generating}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-teal-700 transition-all shadow-lg disabled:opacity-50 flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faQrcode} />
              {generating ? 'Generating...' : 'Generate QR Code'}
            </button>
          )}
        </div>

        {todayQR ? (
          <div className="space-y-6">
            {/* QR Code Display */}
            <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border-2 border-purple-200">
              <div className="bg-white p-6 rounded-xl shadow-lg mb-4">
                <QRCodeSVG
                  id="qr-code-svg"
                  value={todayQR.code}
                  size={300}
                  level="H"
                />
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-800 mb-2">
                  {format(new Date(todayQR.date), 'EEEE, MMMM dd, yyyy')}
                </p>
                <p className="text-sm text-gray-600">
                  Valid from {format(new Date(todayQR.valid_from), 'hh:mm a')} to {format(new Date(todayQR.valid_until), 'hh:mm a')}
                </p>
              </div>
            </div>

            {/* QR Code Text */}
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-600 mb-2 font-semibold">QR Code Value (for manual entry):</p>
              <div className="bg-white p-3 rounded-lg border border-gray-300">
                <code className="text-sm text-gray-800 break-all">{todayQR.code}</code>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleDownloadQR}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faDownload} />
                Download QR Code
              </button>
              <button
                onClick={handlePrintQR}
                className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faPrint} />
                Print QR Code
              </button>
              <button
                onClick={handleGenerateQR}
                disabled={generating}
                className="px-6 py-3 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-700 transition-all shadow-lg disabled:opacity-50 flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faRefresh} />
                Regenerate
              </button>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6">
              <h3 className="font-bold text-blue-900 mb-2">📋 Instructions for Students</h3>
              <ul className="space-y-2 text-blue-800 text-sm">
                <li>• Students can scan this QR code using their phone camera</li>
                <li>• Or they can manually enter the code shown above</li>
                <li>• Each student can mark attendance only once per day</li>
                <li>• QR code is valid only during library hours (6 AM - 11 PM)</li>
                <li>• Print or display this QR code at the library entrance</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <FontAwesomeIcon icon={faQrcode} className="text-6xl text-gray-300 mb-4" />
            <p className="text-xl text-gray-400 mb-2">No QR Code for Today</p>
            <p className="text-gray-500 mb-4">Generate a QR code to allow students to mark attendance</p>
          </div>
        )}
      </div>

      {/* QR Code History */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FontAwesomeIcon icon={faCalendar} className="text-purple-600" />
          QR Code History
        </h2>
        
        {qrCodes.length > 0 ? (
          <div className="space-y-3">
            {qrCodes.slice(0, 10).map((qr) => (
              <div
                key={qr.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FontAwesomeIcon icon={faQrcode} className="text-purple-600 text-xl" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {format(new Date(qr.date), 'EEEE, MMMM dd, yyyy')}
                    </p>
                    <p className="text-sm text-gray-600">
                      Valid: {format(new Date(qr.valid_from), 'hh:mm a')} - {format(new Date(qr.valid_until), 'hh:mm a')}
                    </p>
                  </div>
                </div>
                <span className={`px-4 py-2 rounded-full font-semibold ${
                  qr.is_currently_valid 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {qr.is_currently_valid ? 'Active' : 'Expired'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <p>No QR codes generated yet</p>
          </div>
        )}
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #qr-code-svg, #qr-code-svg * {
            visibility: visible;
          }
          #qr-code-svg {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
          }
        }
      `}</style>
    </div>
  );
};

export default QRCodeManagement;