const mongoose = require('mongoose');
 const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const updateImages = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    await User.updateOne({ email: 'dr.smith@dabms.com' }, { profileImage: '/doctor_smith.png' });
      await User.updateOne({ email: 'dr.jane@dabms.com' }, { profileImage: '/doctor_jane.png' });
       await User.updateOne({ email: 'dr.king@dabms.com' }, { profileImage: '/doctor_king.png' });
     await User.updateOne({ email: 'dr.connor@dabms.com' }, { profileImage: '/doctor_sarah.png' });
    await User.updateOne({ email: 'dr.chang@dabms.com' }, { profileImage: '/doctor_chang.png' });
    
    console.log('✅ Updated profile images successfully.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

updateImages();
