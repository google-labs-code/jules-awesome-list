"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const STORAGE_KEY = "jules_rust_course_progress";
const AUTH_KEY = "jules_rust_is_logged_in";
const USERNAME_KEY = "jules_rust_username";
const PFP_KEY = "jules_rust_pfp";

interface CourseContextType {
    completedModules: string[];
    isLoggedIn: boolean;
    username: string;
    profilePic: string | null;
    mounted: boolean;
    login: (user?: string) => void;
    logout: () => void;
    updateUsername: (newUsername: string) => void;
    markAsCompleted: (moduleId: string) => void;
    isUnlocked: (moduleId: string, previousModuleId?: string) => boolean;
    isCompleted: (moduleId: string) => boolean;
    updateProfilePic: (base64: string) => void;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export function CourseProvider({ children }: { children: React.ReactNode }) {
    const [completedModules, setCompletedModules] = useState<string[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState<string>("");
    const [profilePic, setProfilePic] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const storedProgress = localStorage.getItem(STORAGE_KEY);
        const storedAuth = localStorage.getItem(AUTH_KEY);
        const storedUsername = localStorage.getItem(USERNAME_KEY);
        const storedPfp = localStorage.getItem(PFP_KEY);

        if (storedProgress) {
            try {
                setCompletedModules(JSON.parse(storedProgress));
            } catch (e) {
                console.error("Failed to parse course progress", e);
            }
        }

        if (storedAuth === "true") {
            setIsLoggedIn(true);
        }

        if (storedUsername) {
            setUsername(storedUsername);
        }

        if (storedPfp) {
            setProfilePic(storedPfp);
        }
    }, []);

    const markAsCompleted = (moduleId: string) => {
        setCompletedModules((prev) => {
            if (prev.includes(moduleId)) return prev;
            const updated = [...prev, moduleId];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    };

    const login = (user: string = "Hacker") => {
        setIsLoggedIn(true);
        setUsername(user);
        localStorage.setItem(AUTH_KEY, "true");
        localStorage.setItem(USERNAME_KEY, user);
    };

    const logout = () => {
        setIsLoggedIn(false);
        setUsername("");
        setProfilePic(null);
        localStorage.removeItem(AUTH_KEY);
        localStorage.removeItem(USERNAME_KEY);
        localStorage.removeItem(PFP_KEY);
    };

    const updateUsername = (newUsername: string) => {
        setUsername(newUsername);
        localStorage.setItem(USERNAME_KEY, newUsername);
    };

    const updateProfilePic = (base64: string) => {
        setProfilePic(base64);
        localStorage.setItem(PFP_KEY, base64);
    };

    const isUnlocked = (moduleId: string, previousModuleId?: string) => {
        if (!previousModuleId) return true;
        return completedModules.includes(previousModuleId);
    };

    const isCompleted = (moduleId: string) => {
        return completedModules.includes(moduleId);
    }

    return (
        <CourseContext.Provider
            value={{
                completedModules,
                isLoggedIn,
                username,
                profilePic,
                mounted,
                login,
                logout,
                updateUsername,
                markAsCompleted,
                isUnlocked,
                isCompleted,
                updateProfilePic
            }}
        >
            {children}
        </CourseContext.Provider>
    );
}

export function useCourseContext() {
    const context = useContext(CourseContext);
    if (context === undefined) {
        throw new Error("useCourseContext must be used within a CourseProvider");
    }
    return context;
}
