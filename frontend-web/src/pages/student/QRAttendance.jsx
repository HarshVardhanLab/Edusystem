import { useState, useEffect, useRef } from 'react';
import { qrService } from '../../services/qrService';
import { attendanceService } from '../../services/attendanceService';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faQrcode, faCamera, faKeyboard, faCheck, faHistory, faCalendar
} from '@fortawesome/free-solid-svg-icons';
import { Html5Qrcode } from 'html5-qrcode';
import { format } from 'date-fns';

const QRAttendance = () => {
  const [scanMode, setScanMode] = useState('manual'); // 'camera' or 'manual'
  const [manualCode, setManualCode] = useState('');
  const [scanning, setScanning] = useState(false);
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);

  useEffect(() => {
    fetchTodayAttendance();
    fetchRecentAttendance();
    
    return () => {
      stopScanner();
    };
  }, []);

  const fetchTodayAttendance = async () => {
    try {
      const response = await attendanceService.getAttendance();
      const allAttendance = response.data.results || response.data;
      const today = new Date().toISOString().split('T')[0];
      const todayRecord = allAttendance.find(a => a.date === today);
      setTodayAttendance(todayRecord);
    } catch (error) {
      console.error('Error fetching today attendance:', error);
    }
  };

  const fetchRecentAttendance = async () => {
    try {
      const response = await attendanceService.getAttendance();
      const allAttendance = response.data.results || response.data;
      setRecentAttendance(allAttendance.slice(0, 7));
    } catch (error) {
      console.error('Error fetching recent attendance:', error);
    }
  };

  const startScanner = async () => {
    try {
      setScanning(true);
      
      // Check if we're on localhost or HTTPS
      const isSecureContext = window.isSecureContext;
      if (!isSecureContext) {
        toast.error('Camera requires HTTPS or localhost. Please use manual entry.');
        setScanMode('manual');
        setScanning(false);
        return;
      }

      // Request camera permission first
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
      } catch (permError) {
        console.error('Camera permission denied:', permError);
        toast.error('Camera permission denied. Please allow camera access in your browser settings.');
        setScanMode('manual');
        setScanning(false);
        return;
      }

      html5QrCodeRef.current = new Html5Qrcode("qr-reader");
      
      await html5QrCodeRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        onScanSuccess,
        onScanError
      );
    } catch (error) {
      console.error('Error starting scanner:', error);
      let errorMessage = 'Failed to start camera. ';
      
      if (error.name === 'NotAllowedError') {
        errorMessage += 'Camera permission denied. Please allow camera access.';
      } else if (error.name === 'NotFoundError') {
        errorMessage += 'No camera found on this device.';
      } else if (error.name === 'NotReadableError') {
        errorMessage += 'Camera is already in use by another application.';
      } else {
        errorMessage += 'Please use manual entry instead.';
      }
      
      toast.error(errorMessage);
      setScanMode('manual');
      setScanning(false);
    }
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current && scanning) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
      } catch (error) {
        console.error('Error stopping scanner:', error);
      }
    }
    setScanning(false);
  };

  const onScanSuccess = async (decodedText) => {
    await stopScanner();
    await handleScan(decodedText);
  };

  const onScanError = (error) => {
    // Ignore scan errors (they happen frequently while scanning)
  };

  const handleScan = async (code) => {
    setLoading(true);
    try {
      const response = await qrService.scanQRCode(code);
      toast.success(response.data.message || 'Attendance marked successfully! ✅');
      fetchTodayAttendance();
      fetchRecentAttendance();
      setManualCode('');
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to mark attendance';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualCode.trim()) {
      handleScan(manualCode.trim());
    }
  };

  const handleModeChange = async (mode) => {
    if (mode === 'camera') {
      setScanMode('camera');
      await startScanner();
    } else {
      await stopScanner();
      setScanMode('manual');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">QR Attendance 📱</h1>
        <p className="text-green-100">Scan QR code to mark your attendance</p>
      </div>

      {/* Today's Status */}
      {todayAttendance ? (
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faCheck} className="text-3xl text-green-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Attendance Marked! ✅</h3>
              <p className="text-green-100">
                Today at {format(new Date(todayAttendance.check_in_time), 'hh:mm a')}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faQrcode} className="text-3xl text-orange-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Not Marked Yet</h3>
              <p className="text-orange-100">Scan the QR code to mark your attendance</p>
            </div>
          </div>
        </div>
      )}

      {/* Scanner Section */}
      {!todayAttendance && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* Mode Toggle */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => handleModeChange('camera')}
              disabled={loading}
              className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                scanMode === 'camera'
                  ? 'bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FontAwesomeIcon icon={faCamera} />
              Scan with Camera
            </button>
            <button
              onClick={() => handleModeChange('manual')}
              disabled={loading}
              className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                scanMode === 'manual'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FontAwesomeIcon icon={faKeyboard} />
              Enter Manually
            </button>
          </div>

          {/* Scanner/Manual Input */}
          {scanMode === 'camera' ? (
            <div className="space-y-4">
              <div 
                id="qr-reader" 
                ref={scannerRef}
                className="rounded-xl overflow-hidden border-4 border-green-500"
              />
              {scanning && (
                <div className="text-center">
                  <p className="text-gray-600 mb-2">Position the QR code within the frame</p>
                  <button
                    onClick={stopScanner}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Stop Scanner
                  </button>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter QR Code
                </label>
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="Paste or type the QR code here..."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={loading || !manualCode.trim()}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Marking Attendance...' : 'Mark Attendance'}
              </button>
            </form>
          )}
        </div>
      )}

      {/* Recent Attendance */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FontAwesomeIcon icon={faHistory} className="text-green-600" />
          Recent Attendance
        </h2>
        
        {recentAttendance.length > 0 ? (
          <div className="space-y-3">
            {recentAttendance.map((record, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    record.attendance_type === 'PRESENT' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    <FontAwesomeIcon 
                      icon={faCheck} 
                      className={record.attendance_type === 'PRESENT' ? 'text-green-600' : 'text-red-600'}
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {format(new Date(record.date), 'EEEE, MMMM dd, yyyy')}
                    </p>
                    <p className="text-sm text-gray-600">
                      {format(new Date(record.check_in_time), 'hh:mm a')}
                    </p>
                  </div>
                </div>
                <span className={`px-4 py-2 rounded-full font-semibold ${
                  record.attendance_type === 'PRESENT' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {record.attendance_type}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <FontAwesomeIcon icon={faCalendar} className="text-5xl mb-3 opacity-50" />
            <p>No attendance records yet</p>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6">
        <h3 className="font-bold text-blue-900 mb-2">📋 Instructions</h3>
        <ul className="space-y-2 text-blue-800 text-sm">
          <li>• Ask your library admin for today's QR code</li>
          <li>• Use camera to scan or enter the code manually</li>
          <li>• Attendance can only be marked once per day</li>
          <li>• QR codes are valid only during library hours</li>
          <li>• Contact admin if you face any issues</li>
        </ul>
      </div>

      {/* Camera Permission Help */}
      <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-6">
        <h3 className="font-bold text-yellow-900 mb-2">📷 Camera Not Working?</h3>
        <div className="space-y-3 text-yellow-800 text-sm">
          <p className="font-semibold">Common Issues & Solutions:</p>
          
          <div>
            <p className="font-semibold">1. Permission Denied:</p>
            <ul className="ml-4 mt-1 space-y-1">
              <li>• Click the camera icon in your browser's address bar</li>
              <li>• Select "Allow" for camera access</li>
              <li>• Refresh the page and try again</li>
            </ul>
          </div>

          <div>
            <p className="font-semibold">2. Camera Already in Use:</p>
            <ul className="ml-4 mt-1 space-y-1">
              <li>• Close other apps using the camera (Zoom, Skype, etc.)</li>
              <li>• Close other browser tabs using the camera</li>
              <li>• Restart your browser</li>
            </ul>
          </div>

          <div>
            <p className="font-semibold">3. No Camera Found:</p>
            <ul className="ml-4 mt-1 space-y-1">
              <li>• Make sure your device has a camera</li>
              <li>• Check if camera is enabled in device settings</li>
              <li>• Try using a different device</li>
            </ul>
          </div>

          <div className="mt-3 p-3 bg-yellow-100 rounded">
            <p className="font-semibold">✅ Easy Solution:</p>
            <p>Use <strong>"Enter Manually"</strong> option - it always works! Just copy the code from your admin and paste it.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRAttendance;