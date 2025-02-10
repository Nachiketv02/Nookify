import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import AdminJSMongoose from '@adminjs/mongoose';  // Import as default
import mongoose from 'mongoose';
import express from 'express';

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/yourdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Register AdminJS with Mongoose
AdminJS.registerAdapter(AdminJSMongoose);

// Set up AdminJS with resources
const adminJs = new AdminJS({
  databases: [mongoose],
  rootPath: '/admin',
  resources: [
    { resource: (await import('./Model/listing.js')).default, options: { parent: { name: 'Listings' } } },
    { resource: (await import('./Model/user.js')).default, options: { parent: { name: 'Users' } } },
  ],
});

// Build AdminJS router with authentication
const router = AdminJSExpress.buildAuthenticatedRouter(adminJs, {
  authenticate: async (email, password) => {
    if (email === 'admin@example.com' && password === 'securepassword') {
      return { email };
    }
    return null;
  },
  cookiePassword: 'sessionKey',
});

app.use(adminJs.options.rootPath, router);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
