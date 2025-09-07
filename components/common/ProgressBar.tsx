
import React from 'react';

interface ProgressBarProps {
    value: number;
    maxValue: number;
    color?: string;
    isHealthBar?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, maxValue, color, isHealthBar = false }) => {
    const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;

    const getHealthBarColor = () => {
        const p = percentage / 100;
        if (p > 0.7) {
            const red = (1 - (p - 0.7) / 0.3) * 255;
            return `rgb(${Math.round(red)}, 204, 0)`;
        }
        if (p > 0.3) {
            const green = ((p - 0.3) / 0.4) * 204;
            return `rgb(255, ${Math.round(green)}, 0)`;
        }
        return `rgb(255, 0, 0)`;
    };

    const barStyle = {
        width: `${percentage}%`,
        backgroundColor: isHealthBar && !color ? getHealthBarColor() : undefined,
    };

    const barClassName = color 
        ? `${color} h-full rounded-full`
        : 'h-full rounded-full';

    return (
        <div className="w-full bg-gray-700 rounded-full h-4 border-2 border-gray-900 overflow-hidden">
            <div
                className={barClassName}
                style={barStyle}
            ></div>
        </div>
    );
};

export default ProgressBar;