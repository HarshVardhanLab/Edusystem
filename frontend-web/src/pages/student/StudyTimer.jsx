import { useState, useEffect, useRef } from 'react';
import { studySessionService } from '../../services/studySessionService';
import { getUser } from '../../utils/auth';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlay, faPause, faStop, faClock, faHistory, faChartLine
} from '@fortawesome/free-solid-svg-icons';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';

const StudyTimer = () => {
  const [timerMode, setTimerMode] = useState('POMODORO'); // POMODORO or CUSTOM
  const [duration, setDuration] = useState(25); // minutes
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration * 60); // seconds
  const [currentSession, setCurrentSession] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [todayTotal, setTodayTotal] = useState(0);
  const [key, setKey] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    setTimeLeft(duration * 60);
  }, [duration]);

  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isPaused]);

  const fetchSessions = async () => {
    try {
      const response = await studySessionService.getSessions();
      const allSessions = response.data.results || response.data;
      setSessions(allSessions.slice(0, 10)); // Last 10 sessions

      // Calculate today's total
      const today = new Date().toISOString().split('T')[0];
      const todaySessions = allSessions.filter(s => 
        s.start_time && s.start_time.startsWith(today)
      );
      const total = todaySessions.reduce((sum, s) => sum + (s.duration || 0), 0);
      setTodayTotal(total);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const handleStart = async () => {
    try {
      const user = getUser();
      const response = await studySessionService.createSession({
        student: user.id,
        start_time: new Date().toISOString(),
        session_type: timerMode,
        is_active: true
      });
      
      setCurrentSession(response.data);
      setIsActive(true);
      setIsPaused(false);
      setKey(prevKey => prevKey + 1);
      toast.success('Study session started!');
    } catch (error) {
      toast.error('Failed to start session');
    }
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
    toast.info(isPaused ? 'Resumed' : 'Paused');
  };

  const handleStop = async () => {
    if (currentSession) {
      try {
        const elapsedMinutes = Math.floor((duration * 60 - timeLeft) / 60);
        await studySessionService.updateSession(currentSession.id, {
          end_time: new Date().toISOString(),
          duration: elapsedMinutes,
          is_active: false
        });
        
        toast.success(`Session saved! ${elapsedMinutes} minutes`);
        fetchSessions();
      } catch (error) {
        toast.error('Failed to save session');
      }
    }
    
    resetTimer();
  };

  const handleTimerComplete = async () => {
    if (currentSession) {
      try {
        await studySessionService.updateSession(currentSession.id, {
          end_time: new Date().toISOString(),
          duration: duration,
          is_active: false
        });
        
        toast.success(`Great job! ${duration} minutes completed! 🎉`);
        fetchSessions();
      } catch (error) {
        toast.error('Failed to save session');
      }
    }
    
    resetTimer();
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(duration * 60);
    setCurrentSession(null);
    setKey(prevKey => prevKey + 1);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Study Timer ⏱️</h1>
        <p className="text-purple-100">Track your study sessions and stay focused</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timer Section */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-8">
          {/* Mode Selection */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => {
                if (!isActive) {
                  setTimerMode('POMODORO');
                  setDuration(25);
                }
              }}
              disabled={isActive}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                timerMode === 'POMODORO'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              } ${isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Pomodoro (25 min)
            </button>
            <button
              onClick={() => {
                if (!isActive) {
                  setTimerMode('CUSTOM');
                }
              }}
              disabled={isActive}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                timerMode === 'CUSTOM'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              } ${isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Custom
            </button>
          </div>

          {/* Custom Duration Input */}
          {timerMode === 'CUSTOM' && !isActive && (
            <div className="flex justify-center mb-6">
              <input
                type="number"
                min="1"
                max="180"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
                className="w-32 px-4 py-2 border-2 border-gray-300 rounded-lg text-center text-xl font-semibold focus:outline-none focus:border-blue-500"
              />
              <span className="ml-2 text-gray-600 self-center">minutes</span>
            </div>
          )}

          {/* Timer Display */}
          <div className="flex justify-center mb-8">
            <CountdownCircleTimer
              key={key}
              isPlaying={isActive && !isPaused}
              duration={duration * 60}
              initialRemainingTime={timeLeft}
              colors={['#10b981', '#f59e0b', '#ef4444']}
              colorsTime={[duration * 60 * 0.5, duration * 60 * 0.25, 0]}
              size={280}
              strokeWidth={12}
              trailColor="#e5e7eb"
              onComplete={() => {
                handleTimerComplete();
                return { shouldRepeat: false };
              }}
            >
              {() => (
                <div className="text-center">
                  <div className="text-6xl font-bold text-gray-800 mb-2">
                    {formatTime(timeLeft)}
                  </div>
                  <div className="text-gray-500 text-sm">
                    {isActive ? (isPaused ? 'Paused' : 'In Progress') : 'Ready to start'}
                  </div>
                </div>
              )}
            </CountdownCircleTimer>
          </div>

          {/* Control Buttons */}
          <div className="flex justify-center gap-4">
            {!isActive ? (
              <button
                onClick={handleStart}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-lg transform hover:scale-105 flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faPlay} />
                Start Session
              </button>
            ) : (
              <>
                <button
                  onClick={handlePause}
                  className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl font-semibold hover:from-yellow-600 hover:to-yellow-700 transition-all shadow-lg transform hover:scale-105 flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faPause} />
                  {isPaused ? 'Resume' : 'Pause'}
                </button>
                <button
                  onClick={handleStop}
                  className="px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all shadow-lg transform hover:scale-105 flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faStop} />
                  Stop
                </button>
              </>
            )}
          </div>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          {/* Today's Total */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <FontAwesomeIcon icon={faClock} className="text-3xl opacity-80" />
            </div>
            <h3 className="text-4xl font-bold mb-1">{formatDuration(todayTotal)}</h3>
            <p className="text-blue-100">Today's Total</p>
          </div>

          {/* Session History */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faHistory} className="text-purple-600" />
              Recent Sessions
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {sessions.length > 0 ? (
                sessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-800">{formatDuration(session.duration)}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(session.start_time).toLocaleDateString()} • {session.session_type}
                      </p>
                    </div>
                    <FontAwesomeIcon icon={faChartLine} className="text-green-500" />
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400 py-4">No sessions yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyTimer;