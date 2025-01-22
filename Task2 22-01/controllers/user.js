import fs from "fs/promises";

const usersFilePath = "./data/users.json";

// Get Profile using Async/Await
export const getProfile = async (req, res) => {
    try {
        const data = await fs.readFile(usersFilePath, "utf8");
        const users = JSON.parse(data || "[]");
        const user = users.find((u) => u.name === req.params.name);

        if (user) {
            res.status(200).json({ code: "1", message: "Profile fetched successfully", data: user });
        } else {
            res.status(404).json({ code: "0", message: "User not found", data: null });
        }
    } catch {
        res.status(500).json({ code: "0", message: "Error fetching profile", data: null });
    }
};

// Update Profile using Promises
export const updateProfile = (req, res) => {
    const { email, name, about } = req.body;
    const { name: oldName } = req.params;

    fs.readFile(usersFilePath, "utf8")
        .then((data) => {
            const users = JSON.parse(data || "[]");
            const userIndex = users.findIndex((u) => u.name === oldName);

            if (userIndex === -1) {
                return res.status(404).json({ code: "0", message: "User not found", data: null });
            }

            users[userIndex] = { ...users[userIndex], about};
            return fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));
        })
        .then(() => res.status(200).json({ code: "1", message: "Profile updated successfully", data: { name, about } }))
        .catch(() => res.status(500).json({ code: "0", message: "Error updating profile", data: null }));
};
