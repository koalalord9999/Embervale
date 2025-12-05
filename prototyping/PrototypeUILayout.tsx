
import React from 'react';
import { ActivePanel } from '../types';

interface PrototypeUILayoutProps {
    children: React.ReactNode; // GameCanvas
    minimap: React.ReactNode;
    combatView: React.ReactNode;
    activityLog: React.ReactNode;
    panelButtons: React.ReactNode;
    activePanelContent: React.ReactNode;
    isPanelOpen: boolean;
}

const PrototypeUILayout: React.FC<PrototypeUILayoutProps> = ({
    children,
    minimap,
    combatView,
    activityLog,
    panelButtons,
    activePanelContent,
    isPanelOpen,
}) => {
    // This function is local to the layout, as it doesn't depend on game state.
    const stopPropagation = (e: React.MouseEvent | React.TouchEvent) => {
        e.stopPropagation();
    };

    return (
        <div className="relative w-full h-full bg-gray-900 overflow-hidden font-mono">
            {/* Game Canvas */}
            <div className="absolute inset-0 z-0">
                {children}
            </div>
    
            {/* Top-Right: Minimap */}
            <div className="absolute top-4 right-4 z-10 pointer-events-auto">
                 {minimap}
            </div>
    
            {combatView}
    
            {/* Bottom UI Container */}
            <div className="absolute bottom-0 left-0 right-0 h-[224px] flex items-end pointer-events-none">
                {/* Left side: Chatbox */}
                <div className="w-[520px] h-full p-2 pl-4 pb-4 pointer-events-auto">
                    <div className="h-full flex flex-col bg-black/70 border-2 border-gray-600 rounded-lg">
                        <div className="flex-shrink-0 bg-gray-900/50 p-1 flex items-center gap-1 rounded-t-md">
                            {['All', 'Game', 'Public', 'Private', 'Clan', 'Trade'].map(label => (
                                <button key={label} className="px-3 py-0.5 text-sm text-gray-300 rounded hover:bg-gray-700">{label}</button>
                            ))}
                        </div>
                        <div className="flex-grow p-2 overflow-y-auto min-h-0">
                            {activityLog}
                        </div>
                    </div>
                </div>
    
                {/* Gap */}
                <div className="flex-grow h-full" />
    
                {/* Right side: Control Panel */}
                <div className="relative pointer-events-auto">
                    {/* Floating Panel */}
                    {isPanelOpen && (
                        <div 
                            className="absolute bottom-full right-0 w-[252px] h-[448px] bg-black/80 border-2 border-gray-600 rounded-lg p-2 mb-2"
                            onMouseDown={stopPropagation} onTouchStart={stopPropagation}
                        >
                            {activePanelContent}
                        </div>
                    )}
                    {/* Button Bar */}
                    <div className="w-auto h-auto p-2 pr-4 pb-4">
                         <div className="bg-black/70 border-2 border-gray-600 rounded-lg p-1 flex gap-1">
                            {panelButtons}
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrototypeUILayout;
