const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { authenticateUser } = require("../middleware/authMiddleware");

jest.mock("jsonwebtoken");
jest.mock("../models/User");

describe("Authentication Middleware", () => {
  test("should return 401 for missing token", async () => {
    const req = { header: jest.fn().mockReturnValue(null) };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    await authenticateUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Authentication failed: Missing or invalid token",
    });
  });

  test("should return 401 for invalid token", async () => {
    const req = { header: jest.fn().mockReturnValue("Bearer invalidtoken") };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    jwt.verify.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    await authenticateUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Authentication failed: Invalid token",
    });
  });

  test("should return 401 if user not found", async () => {
    const req = { header: jest.fn().mockReturnValue("Bearer validtoken") };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    jwt.verify.mockReturnValue({ id: "testUserId" });
    User.findById.mockResolvedValue(null);

    await authenticateUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
  });

  test("should call next if authentication succeeds", async () => {
    const req = { header: jest.fn().mockReturnValue("Bearer validtoken") };
    const res = {};
    const next = jest.fn();

    const user = {
      _id: "testUserId",
      username: "testuser",
      email: "test@example.com",
    };
    jwt.verify.mockReturnValue({ id: user._id });
    User.findById.mockResolvedValue(user);

    await authenticateUser(req, res, next);

    expect(req.user).toEqual(user);
    expect(next).toHaveBeenCalled();
  });
});
