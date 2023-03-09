const userSchema = require("../models/userSchema");

const userRoutes = (fastify, option, done) => {
  fastify.get("/api/user", async (req, replay) => {
    try {
      const user = await userSchema.find();
      replay.send({ user: user });
    } catch (error) {
      replay.send({ error: error });
    }
  });

  //   REGISTER
  fastify.post("/api/user/create", async (req, replay) => {
    try {
      const { username, email, balance } = req.body;
      if (!username || !email || !balance) {
        replay.send({
          success: false,
          message: "All fields are required",
        });
      } else {
        const user = new userSchema({
          username,
          email,
          balance,
        });

        const res = await user.save();
        if (res) {
          replay.send({
            success: true,
            message: "User created successfully",
          });
        } else {
          replay.send({
            success: false,
            message: "User creation failed",
          });
        }
      }
    } catch (error) {
      res.send({ error: error });
    }
  });

  //   UPDATE
  fastify.put("/api/user/update/:id", async (req, replay) => {
    try {
      const id = req.params.id;
      const res = await userSchema.findById({ _id: id });
      if (res) {
        replay.send({
          success: true,
          user: res,
        });
      } else {
        replay.send({
          success: false,
          message: "User not found",
        });
      }
    } catch (error) {
      replay.send({ error: error });
    }
  });

  fastify.patch("/api/user/:id", async (req, replay) => {
    try {
      const id = req.params.id;
      const { username, email, balance } = req.body;
      if (!username || !email || !balance) {
        replay.send({
          success: false,
          message: "All fields are required",
        });
      } else {
        const user = await userSchema.findByIdAndUpdate(
          { _id: id },
          {
            username,
            email,
            balance,
          }
        );

        if (user) {
          replay.send({
            success: true,
            message: "User updated successfully",
          });
        } else {
          replay.send({
            success: false,
            message: "User update failed",
          });
        }
      }
    } catch (error) {
      replay.send({ error: error });
    }
  });

  done();
};

module.exports = userRoutes;
