module.exports = {
  apps: [
    {
      name: "morgan_elites_server",
      script: "./dist/server.js",
      watch: false,
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "morgan_elites_email_worker",
      script: "./dist/workers/emailWorker.js",
      watch: false,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
