const express = require('express');
const app = require('./server'); // This might not work if server.js doesn't export app

// I'll just write a script that imports 'express' and the routes and checks them
const authRoutes = require('./routes/authRoutes');

console.log('Auth Routes:');
authRoutes.stack.forEach(r => {
  if (r.route && r.route.path) {
    console.log(`- ${Object.keys(r.route.methods).join(', ').toUpperCase()} ${r.route.path}`);
  }
});
