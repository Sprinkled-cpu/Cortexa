import express from "express";

const router = express.Router();

router.get("/search", async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) return res.status(400).json({ message: "Query param 'q' required" });

        const apiKey = process.env.PEXELS_API_KEY;
        if (!apiKey) return res.status(500).json({ message: "PEXELS_API_KEY not configured" });

        const response = await fetch(
            `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&size=small`,
            { headers: { Authorization: apiKey } }
        );

        if (!response.ok) return res.status(502).json({ message: "Pexels API error" });

        const data = await response.json();
        const photo = data.photos?.[0];

        if (!photo) return res.json({ url: null });

        res.json({
            url: photo.src.medium,
            alt: photo.alt || query,
            photographer: photo.photographer,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
