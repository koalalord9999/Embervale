import React, { useState, useEffect } from 'react';
import { ActiveSingleAction } from '../../hooks/useUIState';
import Button from '../common/Button';
import ProgressBar from '../common/ProgressBar';

interface SingleActionProgressViewProps {
    action: ActiveSingleAction;
    onCancel: () => void;
}

const SingleActionProgressView: React.FC<SingleActionProgressViewProps> = ({ action, onCancel }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let frameId: number;
        const updateProgress = () => {
            const elapsed = Date.now() - action.startTime;
            const newProgress = Math.min(100, (elapsed / action.duration) * 100);
            setProgress(newProgress);
            if (newProgress < 100) {
                frameId = requestAnimationFrame(updateProgress);
            }
        };
        frameId = requestAnimationFrame(updateProgress);
        return () => cancelAnimationFrame(frameId);
    }, [action.startTime, action.duration]);

    return (
        <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">{action.title}</h2>
            
            <div className="w-24 h-24 bg-gray-900 border-4 border-gray-600 rounded-lg flex items-center justify-center mb-4">
                <img src={action.iconUrl} alt={action.title} className={`w-16 h-16 ${action.iconClassName}`} />
            </div>

            <div className="w-full max-w-md bg-black/50 p-4 rounded-lg space-y-3">
                <ProgressBar value={progress} maxValue={100} color="bg-green-600" />
            </div>

            <Button onClick={onCancel} variant="secondary" className="mt-6">
                Cancel
            </Button>
        </div>
    );
};

export default SingleActionProgressView;