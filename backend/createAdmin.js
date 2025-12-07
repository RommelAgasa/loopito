import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from './models/Admin.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  await Admin.deleteMany({});
  await Admin.create({ 
    username: 'kyla', 
    password: '134',
    role: 'admin'
  });
  console.log('✅ Admin created!');
  process.exit();
});