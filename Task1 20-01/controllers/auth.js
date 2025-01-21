export const login = (req, res) => {
    const { email, password } = req.body;
    if (email && password) {
        const response = {
            code: "1",
            message: "Login successful",
            data: { email }
        };
        res.status(200).json(response);
    } else {
        const response = {
            code: "0",
            message: "Login failed. Missing credentials",
            data: null
        };
        res.status(400).json(response);
    }
};

export const signup = (req, res) => {
    const { name, email, password } = req.body;
    if (name && email && password) {
        const response = {
            code: "1",
            message: "Signup successful",
            data: { name, email }
        };
        res.status(201).json(response);
    } else {
        const response = {
            code: "0",
            message: "Signup failed. Missing fields",
            data: null
        };
        res.status(400).json(response);
    }
};

export const logout = (req, res) => {
    const { name, email} = req.body;
    const response = {
        code: "1",
        message: "Logout successful",
        data: { name, email }
    };
    res.status(200).json(response);
};
