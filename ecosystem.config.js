// PM2 process config — keeps the Next.js server running and restarts it on
// crash or server reboot. Usage on the VPS:
//   pm2 start ecosystem.config.js
//   pm2 save && pm2 startup   (so it survives reboots)
module.exports = {
  apps: [
    {
      name: "ske-web",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: "3000",
      },
      max_memory_restart: "512M",
      autorestart: true,
    },
  ],
};
