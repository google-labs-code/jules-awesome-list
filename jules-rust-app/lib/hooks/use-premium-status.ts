"use client";

import { useState, useEffect } from "react";

export function usePremiumStatus() {
    const [hasPurchasedBundle, setHasPurchasedBundle] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const stored = localStorage.getItem("jules_app_premium_bundle");
        if (stored === "true") {
            setHasPurchasedBundle(true);
        }
    }, []);

    const purchaseBundle = () => {
        localStorage.setItem("jules_app_premium_bundle", "true");
        setHasPurchasedBundle(true);
        // Simulate a recharge signal/event if needed elsewhere
        window.dispatchEvent(new Event("storage"));
    };

    return {
        hasPurchasedBundle,
        purchaseBundle,
        mounted
    };
}
