// Script to re-add Dijana to staff collection
// Run with: node re-add-dijana.js

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, query, where, getDocs, Timestamp } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyDCzJ1LFLnY5QV5P5VdkVdeFbCaEVZU4tA",
  authDomain: "cleansweephq-dmwr4.firebaseapp.com",
  projectId: "cleansweephq-dmwr4",
  storageBucket: "cleansweephq-dmwr4.firebasestorage.app",
  messagingSenderId: "847816987387",
  appId: "1:847816987387:web:a1f23b4c5d6e7f8g9h"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const generateAvatarDataUrl = (name, bgColor = 'E6E6FA', textColor = '800000', size = 40) => {
  const initials = name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');

  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#${bgColor}"/>
      <text x="50%" y="50%" text-anchor="middle" dy="0.3em" 
            font-family="Arial, sans-serif" font-size="${size * 0.4}" 
            font-weight="bold" fill="#${textColor}">
        ${initials}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
};

async function reAddDijana() {
  try {
    console.log('Checking if Dijana exists in staff...');
    
    // Check if Dijana already exists in staff
    const staffQuery = query(
      collection(db, 'staff'), 
      where('email', '==', 'dijanatodorovic88@gmail.com')
    );
    
    const querySnapshot = await getDocs(staffQuery);
    
    if (querySnapshot.empty) {
      console.log('Dijana not found in staff. Adding her...');
      
      const dijanaStaff = {
        name: 'Dijana Todorovic',
        email: 'dijanatodorovic88@gmail.com',
        position: 'Owner/Manager',
        skills: ['Business Management', 'Operations', 'Customer Service', 'Quality Control'],
        location: 'Sydney',
        availability: 'Mon-Fri 8am-6pm',
        avatar: generateAvatarDataUrl('Dijana Todorovic'),
        phone: '',
        createdAt: Timestamp.now()
      };
      
      const docRef = await addDoc(collection(db, 'staff'), dijanaStaff);
      console.log('✅ Dijana added successfully with ID:', docRef.id);
    } else {
      console.log('✅ Dijana already exists in staff collection');
    }
    
  } catch (error) {
    console.error('❌ Error adding Dijana:', error);
  }
}

reAddDijana();
