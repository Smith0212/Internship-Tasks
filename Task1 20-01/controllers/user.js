export const getProfile = (req, res) => {
    const profile = {
        name: "Smit",
        email: "smit@gmail.com",
        about: "This is a sample user profile."
    };
    const response = {
        code: "1",
        message: "Profile fetched successfully",
        data: profile
    };
    res.status(200).json(response);
};

export const updateProfile = (req, res) => {
    const { name, about } = req.body;
    if (name && about) {
        const response = {
            code: "1",
            message: "Profile updated successfully",
            data: { name, about }
        };
        res.status(200).json(response);
    } else {
        const response = {
            code: "0",
            message: "Profile update failed. Missing fields",
            data: null
        };
        res.status(400).json(response);
    }
};
