import { useEffect, useState } from 'react';

const Timer = ({ initialTime }) => {
  const [isSticky, setIsSticky] = useState(true);
  const parseTime = (timeString) => {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  const [timeInSeconds, setTimeInSeconds] = useState(() => parseTime(initialTime));

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimeInSeconds((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(countdown);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  const formatTime = () => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    return [hours, minutes, seconds].map((val) => val.toString().padStart(2, '0')).join(':');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY === 0);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 999, background: 'white', padding: '10px' }}>
      {formatTime()}
    </div>
  );
};

export default Timer;
