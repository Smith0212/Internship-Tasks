import fs from "fs/promises";

const placesFilePath = "./data/places.json";
const reviewsFilePath = "./data/reviews.json";


// Add Place using Async/Await
export const addPlace = async (req, res) => {
    const { location, about, picture } = req.body;

    if (!location || !about || !picture) {
        return res.status(400).json({ code: "0", message: "Place addition failed. Missing fields", data: null });
    }

    try {
        const data = await fs.readFile(placesFilePath, "utf8");
        const places = JSON.parse(data || "[]");

        const newPlace = { id: places.length + 1, location, about, picture };
        places.push(newPlace);

        await fs.writeFile(placesFilePath, JSON.stringify(places, null, 2));
        res.status(201).json({ code: "1", message: "Place added successfully", data: newPlace });
    } catch {
        res.status(500).json({ code: "0", message: "Error saving place data", data: null });
    }
};

// Get Places using Promises
export const getPlaces = (req, res) => {
    fs.readFile(placesFilePath, "utf8")
        .then((data) => {
            const places = JSON.parse(data || "[]");
            res.status(200).json({
                code: places.length > 0 ? "1" : "2",
                message: places.length > 0 ? "Places fetched successfully" : "No places found",
                data: places
            });
        })
        .catch(() => res.status(500).json({ code: "0", message: "Error fetching places", data: null }));
};

export const getPlaceDetails = async (req, res) => {
    const { id } = req.params;

    try {
        const data = await fs.readFile(placesFilePath, "utf8");
        const places = JSON.parse(data || "[]");

        const place = places.find((p) => p.id === parseInt(id));
        if (place) {
            res.status(200).json({ code: "1", message: "Place details fetched successfully", data: place });
        } else {
            res.status(404).json({ code: "0", message: "Place not found", data: null });
        }
    } catch {
        res.status(500).json({ code: "0", message: "Error fetching place details", data: null });
    }
};

// Async/Await
export const getPlaceReviews = async (req, res) => {
    const { id } = req.params;
    console.log(id);
    try {
        const data = await fs.readFile(reviewsFilePath, "utf8");
        const reviews = JSON.parse(data || "[]");

        const placeReviews = reviews.filter((review) => review.placeId === parseInt(id));
        if (placeReviews.length > 0) {
            res.status(200).json({ code: "1", message: "Reviews fetched successfully", data: placeReviews });
        } else {
            res.status(404).json({ code: "0", message: "No reviews found for this place", data: [] });
        }
    } catch {
        res.status(500).json({ code: "0", message: "Error fetching reviews", data: null });
    }
};

// Add Review using Async/Await
export const addReview = async (req, res) => {
    const { id } = req.params;
    const { user, review } = req.body;

    if (!user || !review) {
        return res.status(400).json({ code: "0", message: "Review addition failed. Missing fields", data: null });
    }

    try {
        console.log(1);
        const data = await fs.readFile(reviewsFilePath, "utf8");
        console.log(2);
        const reviews = JSON.parse(data || "[]");
        console.log(3);

        const newReview = { placeId: parseInt(id), user, review };
        console.log(newReview);
        reviews.push(newReview);

        await fs.writeFile(reviewsFilePath, JSON.stringify(reviews, null, 2));
        res.status(201).json({ code: "1", message: "Review added successfully", data: newReview });
    } catch {
        res.status(500).json({ code: "0", message: "Error saving review", data: null });
    }
};
