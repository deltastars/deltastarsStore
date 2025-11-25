
import React from 'react';
import { XIcon } from './Icons';

interface ImageZoomModalProps {
    src: string;
    alt: string;
    onClose: () => void;
}

export const ImageZoomModal: React.FC<ImageZoomModalProps> = ({ src, alt, onClose }) => {
    return (
        <div 
            className="fixed inset-0 z-[100] bg-black bg-opacity-90 flex justify-center items-center p-4 animate-fade-in cursor-zoom-out" 
            onClick={onClose}
        >
            <button 
                className="absolute top-4 right-4 text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-50" 
                onClick={onClose}
                aria-label="Close Zoom"
            >
                <XIcon className="w-8 h-8" />
            </button>
            <img 
                src={src} 
                alt={alt} 
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl transform transition-transform duration-300 cursor-default"
                onClick={(e) => e.stopPropagation()} 
            />
        </div>
    );
};
