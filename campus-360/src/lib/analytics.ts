export const logEvent = (eventName: string, properties?: Record<string, any>) => {
    const event = {
        timestamp: new Date().toISOString(),
        event: eventName,
        ...properties
    };

    // In a real app, send to server.
    // For local kiosk, log to console or localStorage
    console.log("[Analytics]", event);

    try {
        const history = JSON.parse(localStorage.getItem('analytics_history') || '[]');
        history.push(event);
        // Keep last 1000 events
        if (history.length > 1000) history.shift();
        localStorage.setItem('analytics_history', JSON.stringify(history));
    } catch (e) {
        console.warn("Analytics storage failed", e);
    }
};

export const logPageView = (pageName: string) => {
    logEvent('page_view', { page: pageName });
};
