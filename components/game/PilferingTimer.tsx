import React, { useState, useEffect } from 'react';
import ProgressBar from '../common/ProgressBar';

interface PilferingTimerProps {
    startTime: number;
    duration: number; // in milliseconds
}

const formatTime = (ms: number) => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const PilferingTimer: React.FC<PilferingTimerProps> = ({ startTime, duration }) => {
    const [timeLeft, setTimeLeft] = useState(duration);

    useEffect(() => {
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const remaining = duration - elapsed;
            setTimeLeft(Math.max(0, remaining));
        }, 250); // Update 4 times a second for smoother bar

        return () => clearInterval(interval);
    }, [startTime, duration]);

    const progress = (timeLeft / duration) * 100;
    const barColor = progress > 50 ? 'bg-green-500' : progress > 20 ? 'bg-yellow-500' : 'bg-red-500';

    return (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1/3 max-w-sm bg-black/70 p-2 rounded-lg border-2 border-red-700 shadow-lg z-20">
            <div className="text-center">
                <p className="text-sm font-bold text-red-400">Owners Return In:</p>
                <p className="text-lg font-mono font-bold text-white">{formatTime(timeLeft)}</p>
                <div className="mt-1">
                    <ProgressBar value={timeLeft} maxValue={duration} color={barColor} />
                </div>
            </div>
        </div>
    );
};

export default PilferingTimer;
