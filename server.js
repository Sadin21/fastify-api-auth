const fastify = require("fastify")({ logger: true, pluginTimeout: 20000 });
const PORT = process.env.PORT || 3000;

require("./connection/config");
fastify.register(require("./routes/userRoute"));
fastify.register(require("./routes/adminRoute"));

fastify.listen(PORT, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`server listening on ${address}`);
  //   console.log(`Server running on port 3000`);
});
