const UserService = require("../services/users.service");

class UserController {
  async getAllUsers(req, res) {
    try {
      const users = await UserService.getAllUsers();
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const requester = req.user;
      if (requester.role !== "admin" && requester.uid !== id) {
        return res
          .status(403)
          .json({ message: "Forbidden: You can only view your own profile" });
      }

      const user = await UserService.getUserById(id);
      if (!user) return res.status(404).json({ message: "User not found" });

      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async updateUser(req, res) {
    try {
        const { id } = req.params;
        const requester = req.user; 
        if (requester.role !== "admin" && requester.uid !== id) {
            return res.status(403).json({ 
                message: "Forbidden: You can only update your own profile" 
            });
        }
        const { fname, lname, phone, username } = req.body;
        let cleanData = { fname, lname, phone, username };
        if (requester.role === "admin") {
            if (req.body.status) cleanData.status = req.body.status;
        }
        const updated = await UserService.updateUser(id, cleanData);
        if (!updated) {
            return res.status(400).json({ message: "Update failed or User not found" });
        }

        return res.status(200).json({ message: "User updated successfully" });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const deleted = await UserService.deleteUser(id);
      if (!deleted) return res.status(404).json({ message: "User not found" });

      return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new UserController();
