const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { register, login } = require("../controllers/authController");

jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("../models/User");

describe("Authentication Controller", () => {
  beforeAll(() => {
    process.env.JWT_SECRET = "testsecret";
  });

  describe("register", () => {
    test("should register a new user", async () => {
      const req = {
        body: {
          username: "testuser",
          email: "test@example.com",
          password: "password",
        },
      };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      bcrypt.hash.mockResolvedValue("hashedpassword");
      User.create.mockResolvedValue({
        _id: "testUserId",
        username: "testuser",
        email: "test@example.com",
      });
      jwt.sign.mockReturnValue("validtoken");

      await register(req, res);

      expect(bcrypt.hash).toHaveBeenCalledWith("password", 10);
      expect(User.create).toHaveBeenCalledWith({
        username: "testuser",
        email: "test@example.com",
        password: "hashedpassword",
      });
      expect(res.json).toHaveBeenCalledWith({
        token: "validtoken",
        message: "Registration successful!",
      });
    });

    test("should return 500 if registration fails", async () => {
      const req = {
        body: {
          username: "testuser",
          email: "test@example.com",
          password: "password",
        },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      bcrypt.hash.mockRejectedValue(new Error("Hashing error"));

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Hashing error" });
    });
  });

  describe("login", () => {
    test("should login a user with valid credentials", async () => {
      const req = { body: { email: "test@example.com", password: "password" } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      const user = {
        _id: "testUserId",
        username: "testuser",
        email: "test@example.com",
        password: "hashedpassword",
      };
      User.findOne.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("validtoken");

      await login(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
      expect(bcrypt.compare).toHaveBeenCalledWith("password", "hashedpassword");
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      expect(res.json).toHaveBeenCalledWith({
        "User Token": "validtoken",
        message: "Login Successful!",
      });
    });

    test("should return 401 for invalid credentials", async () => {
      const req = {
        body: { email: "test@example.com", password: "wrongpassword" },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      const user = {
        _id: "testUserId",
        username: "testuser",
        email: "test@example.com",
        password: "hashedpassword",
      };
      User.findOne.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(false);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: "Invalid email or password",
      });
    });

    test("should return 500 if login fails", async () => {
      const req = { body: { email: "test@example.com", password: "password" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      User.findOne.mockRejectedValue(new Error("Login error"));

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Login error" });
    });
  });
});
