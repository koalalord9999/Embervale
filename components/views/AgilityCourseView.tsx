import React from 'react';
import { useAgility } from '../../hooks/useAgility';
import { AGILITY_COURSES } from '../../constants';
import Button from '../common/Button';

interface AgilityCourseViewProps {
    agility: ReturnType<typeof useAgility>;
}

const AgilityCourseView: React.FC<AgilityCourseViewProps> = ({ agility }) => {
    const { agilityState, stopCourse, attemptObstacle } = agility;
    const course = agilityState.activeCourseId ? AGILITY_COURSES[agilityState.activeCourseId] : null;

    if (!course) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-red-500">
                <p>Error: Active course data not found.</p>
                <Button onClick={stopCourse} className="mt-4">Return</Button>
            </div>
        );
    }

    const lapsForThisCourse = agilityState.lapsCompleted[course.id] || 0;

    return (
        <div className="flex flex-col h-full text-gray-200 animate-fade-in p-4 items-center">
            <h1 className="text-3xl font-bold text-yellow-400 mb-2">{course.name}</h1>
            <div className="flex justify-around w-full max-w-md text-lg mb-6">
                <span>Obstacle: {agilityState.currentObstacleIndex + 1} / {course.obstacles.length}</span>
                <span>Laps: {lapsForThisCourse}</span>
            </div>

            <div className="w-full max-w-md space-y-2">
                {course.obstacles.map((obstacle, index) => {
                    const isCurrent = index === agilityState.currentObstacleIndex;
                    const isCompleted = index < agilityState.currentObstacleIndex;

                    return (
                        <Button
                            key={obstacle.id}
                            onClick={isCurrent ? attemptObstacle : undefined}
                            disabled={!isCurrent}
                            className={`w-full text-left justify-start ${isCompleted ? 'bg-gray-700 text-gray-500 line-through' : ''}`}
                            variant={isCurrent ? 'primary' : 'secondary'}
                        >
                            {obstacle.name}
                        </Button>
                    );
                })}
            </div>

            <Button onClick={stopCourse} variant="secondary" className="mt-8">
                Stop Course
            </Button>
        </div>
    );
};

export default AgilityCourseView;