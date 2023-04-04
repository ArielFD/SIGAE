const strapi = require('@strapi/strapi');
strapi().start();

// pm2-windows-startup
// Utility to make PM2 automatically resurrect on Windows startup. The utility achieves this by adding the right registry entry, using start-on-windows-boot.

// Installation and usage
// > npm install pm2-windows-startup -g
// > pm2-startup install
// PM2 will now automatically revive the saved processes on startup. To save the current list of processes execute:

// > pm2 save