# Backend Setup for Shared Inventory Data

## Current Limitation

The inventory system currently uses **localStorage**, which means:
- ❌ Each browser/device has separate data
- ❌ Changes made by one user are NOT visible to others
- ❌ Data is lost if browser cache is cleared

## Solution Options

### Option 1: Simple Backend with Firebase (Recommended for MVP)

**Free tier available, real-time sync**

1. Create a Firebase project at https://firebase.google.com/
2. Enable Firestore Database
3. Add Firebase SDK to your HTML files
4. Replace localStorage calls with Firestore calls

**Cost**: Free for up to 50K reads/20K writes per day

### Option 2: Backend API with Node.js + MongoDB

**Full control, scalable**

1. Set up Node.js server with Express
2. Create MongoDB database (free tier on MongoDB Atlas)
3. Create REST API endpoints:
   - GET /api/inventory - Fetch all items
   - POST /api/inventory - Add new item
   - PUT /api/inventory/:id - Update item
   - DELETE /api/inventory/:id - Delete item
4. Deploy backend on Heroku, Railway, or Render (free tiers available)

**Cost**: Free tier available on most platforms

### Option 3: Backend with Supabase (Easiest)

**PostgreSQL database with built-in auth**

1. Create account at https://supabase.com/
2. Create new project
3. Create `inventory` table
4. Use Supabase JavaScript client in your app
5. Replace localStorage calls with Supabase calls

**Cost**: Free for up to 500MB database

### Option 4: GitHub as Backend (Limited Solution)

**Warning**: GitHub Pages is static hosting and cannot handle write operations properly. This would only work for read-only data or require manual commits for updates.

## Recommended Implementation (Firebase Firestore)

### Step 1: Add Firebase to your project

Add to your HTML files (before closing `</body>` tag):

\`\`\`html
<!-- Firebase App (the core Firebase SDK) -->
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js"></script>
\`\`\`

### Step 2: Initialize Firebase

Create `firebase-config.js`:

\`\`\`javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_ID",
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
\`\`\`

### Step 3: Replace localStorage calls

**Load Data**:
\`\`\`javascript
// Old localStorage way
let inventory = JSON.parse(localStorage.getItem('inventoryData')) || [];

// New Firebase way
db.collection('inventory').get().then((snapshot) => {
  let inventory = [];
  snapshot.forEach((doc) => {
    inventory.push({ id: doc.id, ...doc.data() });
  });
  renderTable();
});
\`\`\`

**Add Item**:
\`\`\`javascript
// Old localStorage way
localStorage.setItem('inventoryData', JSON.stringify(inventory));

// New Firebase way
db.collection('inventory').add(formData).then(() => {
  console.log('Item added successfully');
});
\`\`\`

**Update Item**:
\`\`\`javascript
// New Firebase way
db.collection('inventory').doc(itemId).update({
  quantity: newQuantity,
  status: newStatus
});
\`\`\`

**Delete Item**:
\`\`\`javascript
// New Firebase way
db.collection('inventory').doc(itemId).delete();
\`\`\`

## Next Steps

1. Choose a backend solution based on your needs
2. Set up the backend service
3. Update JavaScript files to use the backend API instead of localStorage
4. Test with multiple users/devices
5. Deploy changes

## Need Help?

For a production-ready solution, you'll need to:
- Set up proper authentication
- Implement data validation
- Add error handling
- Set up database indexes for performance
- Implement proper security rules
