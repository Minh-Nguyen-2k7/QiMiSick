import React, { useEffect, useRef } from 'react';
import { useState, useContext, createContext } from "react";
interface AudioAnalyzerProps {
    isPlaying: boolean;
}

export const AudioAnalyzer = ({ isPlaying }: AudioAnalyzerProps) => {
    useEffect(() => {
        const visualBg = document.getElementById("dynamic-audio-bg");
        if (!visualBg) return;

        if (isPlaying) {
            visualBg.classList.add("animate-pulse-ambient");
        } else {
            visualBg.classList.remove("animate-pulse-ambient");
        }

        // Clean up animation state on component unmount
        return () => {
            if (visualBg) visualBg.classList.remove("animate-pulse-ambient");
        };
    }, [isPlaying]);

    return null;
};

interface AudioContextType {
    isPlaying: boolean;
    currentTrack: any | null;
    currentTrackIndex: number;
    playAlbum: (songsList: any[], index: number) => void;
    togglePlay: () => void;
    setIsPlaying: (playing: boolean) => void; // Added so ReactPlayer can update state directly
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState<any | null>(null);
    const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(-1);
    const [queue, setQueue] = useState<any[]>([]);

    const playAlbum = (songsList: any[], index: number) => {
        if (!songsList || songsList.length === 0) return;
        setQueue(songsList);
        setCurrentTrackIndex(index);
        setCurrentTrack(songsList[index]);
        setIsPlaying(true); // Clicking a song starts playing immediately
    };

    const togglePlay = () => {
        // If no track is selected yet, do nothing on toggle
        if (currentTrackIndex === -1) return;
        setIsPlaying((prev) => !prev);
    };

    return (
        <AudioContext.Provider value={{ isPlaying, currentTrack, currentTrackIndex, playAlbum, togglePlay, setIsPlaying }}>
            {children}
        </AudioContext.Provider>
    );
};

export const useAudio = () => {
    const context = useContext(AudioContext);
    if (!context) throw new Error("useAudio must be wrapped in AudioProvider");
    return context;
};