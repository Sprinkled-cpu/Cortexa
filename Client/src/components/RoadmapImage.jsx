import { useState, useEffect } from "react";
import { searchImage } from "../lib/api";

export default function RoadmapImage({ query }) {
    const [url, setUrl] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!query) { setLoading(false); return; }
        let cancelled = false;
        searchImage(query).then((imageUrl) => {
            if (!cancelled) {
                setUrl(imageUrl);
                setLoading(false);
            }
        });
        return () => { cancelled = true; };
    }, [query]);

    if (loading) {
        return (
            <div className="w-full h-32 rounded-lg bg-gray-800/50 animate-pulse flex items-center justify-center mt-3">
                <span className="text-xs text-gray-600">Loading image...</span>
            </div>
        );
    }

    if (!url) return null;

    return (
        <img
            src={url}
            alt={query}
            loading="lazy"
            className="w-full h-32 object-cover rounded-lg mt-3 opacity-80 hover:opacity-100 transition-opacity duration-300"
        />
    );
}
