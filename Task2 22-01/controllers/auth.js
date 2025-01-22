import fs from "fs/promises";

const usersFilePath = "./data/users.json";

// Login using Promises
export const login = (req, res) => {
    const { email, password } = req.body;

    fs.readFile(usersFilePath, "utf8")
        .then((data) => {
            const users = JSON.parse(data || "[]");
            const user = users.find((u) => u.email === email && u.password === password);

            if (user) {
                res.status(200).json({ code: "1", message: "Login successful", data: { email } });
            } else {
                res.status(401).json({ code: "0", message: "Invalid credentials", data: null });
            }
        })
        .catch(() => res.status(500).json({ code: "0", message: "Error reading users data", data: null }));
};

// Signup using Async/Await
export const signup = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ code: "0", message: "Signup failed. Missing fields", data: null });
    }

    try {
        const data = await fs.readFile(usersFilePath, "utf8");
        const users = JSON.parse(data || "[]");
        users.push({ name, email, password });

        await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));
        res.status(201).json({ code: "1", message: "Signup successful", data: { name, email } });
    } catch {
        res.status(500).json({ code: "0", message: "Error saving user data", data: null });
    }
};

export const logout = (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ code: "0", message: "Logout failed. Missing fields", data: null });
    }

    res.status(200).json({ code: "1", message: "Logout successful", data: { name, email } });
};
