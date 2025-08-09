// Script to remove duplicate Dijana staff entries
// Run with: node fix-dijana-duplicates.js

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, deleteDoc, doc, query, where } = require('firebase/firestore');

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

async function removeDijanaDuplicates() {
  try {
    console.log('Searching for Dijana staff entries...');
    
    // Find all staff entries with Dijana's email
    const staffQuery = query(
      collection(db, 'staff'), 
      where('email', '==', 'dijanatodorovic88@gmail.com')
    );
    
    const querySnapshot = await getDocs(staffQuery);
    const dijanaEntries = querySnapshot.docs;
    
    console.log(`Found ${dijanaEntries.length} Dijana entries`);
    
    if (dijanaEntries.length > 1) {
      // Keep the first entry, delete the rest
      const entriesToDelete = dijanaEntries.slice(1);
      
      console.log(`Removing ${entriesToDelete.length} duplicate entries...`);
      
      for (const entryDoc of entriesToDelete) {
        await deleteDoc(doc(db, 'staff', entryDoc.id));
        console.log(`Deleted duplicate entry: ${entryDoc.id}`);
      }
      
      console.log('✅ Duplicate removal complete!');
      console.log(`Kept entry: ${dijanaEntries[0].id}`);
    } else {
      console.log('✅ No duplicates found');
    }
    
  } catch (error) {
    console.error('❌ Error removing duplicates:', error);
  }
}

removeDijanaDuplicates();
