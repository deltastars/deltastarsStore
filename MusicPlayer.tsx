
import React, { useState, useRef, useEffect } from 'react';
import { Song } from '../../types';
import { ChevronRightIcon, ChevronLeftIcon } from '../lib/Icons';

const PLAYLIST: Song[] = [
    { title: 'Delta Ambience', artist: 'Delta Stars', url: 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3', cover: 'https://i.imgur.com/e5FNW3p.jpeg' },
    { title: 'Fresh Morning', artist: 'Nature Sounds', url: 'https://cdn.pixabay.com/audio/2022/04/27/audio_67bcf729cf.mp3', cover: 'https://i.imgur.com/uR25Q38.jpeg' },
    { title: 'Market Vibes', artist: 'Traditional', url: 'https://cdn.pixabay.com/audio/2021/11/24/audio_8260607266.mp3', cover: 'https://i.imgur.com/8Q2pT6A.jpeg' }
];

export const MusicPlayer: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);

    const currentSong = PLAYLIST[currentSongIndex];

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const nextSong = () => {
        const nextIndex = (currentSongIndex + 1) % PLAYLIST.length;
        setCurrentSongIndex(nextIndex);
        setIsPlaying(true); // Auto play next
    };

    const prevSong = () => {
        const prevIndex = (currentSongIndex - 1 + PLAYLIST.length) % PLAYLIST.length;
        setCurrentSongIndex(prevIndex);
        setIsPlaying(true);
    };

    // Auto-play when song changes if it was already playing
    useEffect(() => {
        if (isPlaying && audioRef.current) {
             audioRef.current.play().catch(e => console.log("Autoplay blocked", e));
        }
    }, [currentSongIndex]);

    return (
        <div className={`fixed bottom-24 left-4 z-40 transition-all duration-300 ${isOpen ? 'w-72' : 'w-12 h-12 rounded-full overflow-hidden'}`}>
            <audio 
                ref={audioRef} 
                src={currentSong.url} 
                onEnded={nextSong}
                loop={false}
            />
            
            {!isOpen && (
                <button onClick={() => setIsOpen(true)} className="w-full h-full bg-primary text-white flex items-center justify-center shadow-lg animate-pulse">
                    🎵
                </button>
            )}

            {isOpen && (
                <div className="bg-white/90 backdrop-blur-md border border-gray-200 shadow-2xl rounded-xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-primary p-2 flex justify-between items-center text-white">
                        <span className="text-xs font-bold">Delta Music</span>
                        <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200 font-bold">&times;</button>
                    </div>
                    
                    {/* Content */}
                    <div className="p-4 flex flex-col items-center">
                        <img src={currentSong.cover} alt="Album Art" className={`w-24 h-24 rounded-full shadow-md mb-3 object-cover ${isPlaying ? 'animate-spin-slow' : ''}`} style={{animationDuration: '10s'}} />
                        <h4 className="font-black text-gray-800 text-sm text-center truncate w-full">{currentSong.title}</h4>
                        <p className="text-xs text-gray-500 font-bold mb-4">{currentSong.artist}</p>
                        
                        {/* Controls */}
                        <div className="flex items-center gap-4">
                            <button onClick={prevSong} className="text-primary hover:text-primary-dark">⏮</button>
                            <button 
                                onClick={togglePlay} 
                                className="w-10 h-10 flex items-center justify-center bg-primary text-white rounded-full shadow-lg hover:scale-105 transition-transform"
                            >
                                {isPlaying ? '⏸' : '▶'}
                            </button>
                            <button onClick={nextSong} className="text-primary hover:text-primary-dark">⏭</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
