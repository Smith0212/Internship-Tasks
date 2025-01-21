export const addPlace = (req, res) => {
    const { location, about, picture } = req.body;
    if (location && about && picture) {
        const response = {
            code: "1",
            message: "Place added successfully",
            data: { location, about, picture }
        };
        res.status(201).json(response);
    } else {
        const response = {
            code: "0",
            message: "Place addition failed. Missing fields",
            data: null
        };
        res.status(400).json(response);
    }
};

export const getPlaces = (req, res) => {
    const places = [
        { id: 1, name: "Place A", location: "City A" },
        { id: 2, name: "Place B", location: "City B" }
    ];
    const response = {
        code: places.length > 0 ? "1" : "2",
        message: places.length > 0 ? "Places fetched successfully" : "No places found",
        data: places
    };
    res.status(200).json(response);
};

export const getPlaceDetails = (req, res) => {
    const { id } = req.params;
    const place = {
        id,
        name: `Place ${id}`,
        location: `City ${id}`,
        details: `Details about Place ${id}`
    };
    const response = {
        code: "1",
        message: "Place details fetched successfully",
        data: place
    };
    res.status(200).json(response);
};

export const addReview = (req, res) => {
    const { id } = req.params;
    const { user, review } = req.body;
    if (user && review) {
        const response = {
            code: "1",
            message: "Review added successfully",
            data: { user, review, placeId: id }
        };
        res.status(201).json(response);
    } else {
        const response = {
            code: "0",
            message: "Review addition failed. Missing fields",
            data: null
        };
        res.status(400).json(response);
    }
};
