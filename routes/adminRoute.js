const bcrypt = require("bcrypt");
const adminSchema = require("../models/adminSchema");
const jwt = require("jsonwebtoken");
const fastify = require("fastify");
require("dotenv").config();

const adminRoute = (fastify, option, done) => {
  fastify.register(require("@fastify/jwt"), {
    secret: "supersecret",
  });

  fastify.get("/api/admin", async (req, reply) => {
    try {
      const admin = await adminSchema.find();
      reply.send({ admin: admin });
    } catch (error) {
      reply.send({ error: error });
    }
  });

  //   REGISTER
  fastify.post("/api/admin/create", async (req, reply) => {
    try {
      const { username, email, password } = req.body;
      if (!username || !email || !password) {
        reply.send({
          success: false,
          message: "All fields are required",
        });
      } else {
        const hashPassword = await bcrypt.hash(password, 10);
        const admin = new adminSchema({
          username: username,
          email: email,
          password: hashPassword,
        });
        const res = await admin.save();
        if (res) {
          reply.send({
            success: true,
            message: "Admin created successfully",
          });
        } else {
          reply.send({
            success: false,
            message: "Admin creation failed",
          });
        }
      }
    } catch (error) {
      reply.send({ error: error });
    }
  });

  //   LOGIN
  fastify.post("/api/admin/login", async (req, reply) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        reply.send({
          success: false,
          message: "All fields are required",
        });
      } else {
        const admin = await adminSchema.findOne({ email: email });
        if (admin) {
          const hashPassword = await bcrypt.compare(password, admin.password);
          if (hashPassword) {
            const payload = { admin_id: admin._id };
            const token = jwt.sign({ payload });
            reply.send({
              success: true,
              message: "Login successful",
              token: token,
            });
          } else {
            reply.send({
              success: false,
              message: "Invalid email and password",
            });
          }
        } else {
          reply.send({
            success: false,
            message: "All fields are required",
          });
        }
      }
    } catch (error) {
      reply.send({ error: error });
    }
  });

  done();
};

module.exports = adminRoute;
