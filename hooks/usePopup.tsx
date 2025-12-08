"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { PopupPayload } from "@/types/popup";

interface PopupContextType {
    isOpen: boolean;
    currentPopup: PopupPayload | null;
    openPopup: (payload: PopupPayload) => void;
    closePopup: () => void;
}

const PopupContext = createContext<PopupContextType | undefined>(undefined);

export function PopupProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentPopup, setCurrentPopup] = useState<PopupPayload | null>(null);

    const openPopup = useCallback((payload: PopupPayload) => {
        setCurrentPopup(payload);
        setIsOpen(true);
    }, []);

    const closePopup = useCallback(() => {
        setIsOpen(false);
    }, []);

    return (
        <PopupContext.Provider value={{ isOpen, currentPopup, openPopup, closePopup }}>
            {children}
        </PopupContext.Provider>
    );
}

export function usePopup() {
    const context = useContext(PopupContext);
    if (!context) {
        throw new Error("usePopup must be used within a PopupProvider");
    }
    return context;
}
