# Firebase Setup Instructions (Free Plan)

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `house-of-festival`
4. **Disable Google Analytics** (not needed for free plan)
5. Click "Create project"

## 2. Enable Authentication

1. In your Firebase project, go to **Authentication** > **Sign-in method**
2. Enable **Email/Password** provider
3. Click **Users** tab
4. Click **Add user** and create an admin user:
   - Email: `admin@houseoffestival.com`
   - Password: `admin123456`

## 3. Create Firestore Database

1. Go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select a location closest to your users (preferably same region)
5. Click **Done**

## 4. Set up Firebase Storage

1. Go to **Storage**
2. Click **Get started**
3. Choose **Start in test mode**
4. Select the same location as your Firestore
5. Click **Done**

## 5. Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll down to **Your apps**
3. Click **Web app** icon (`</>`)
4. Register your app with name: `House of Festival`
5. Copy the Firebase configuration object

## 6. Update Firebase Configuration

Replace the configuration in `src/firebase.ts` with your actual values:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-actual-sender-id",
  appId: "your-actual-app-id"
};
```

## 7. Firebase Free Plan Limits & Optimizations

### Firestore Database (Free Limits)
- **Reads**: 50,000 per day
- **Writes**: 20,000 per day
- **Deletes**: 20,000 per day
- **Storage**: 1 GiB

### Storage (Free Limits)
- **Storage**: 5 GB
- **Downloads**: 1 GB per day
- **Uploads**: 20,000 per day

### Authentication (Free Limits)
- **Users**: Unlimited
- **Sign-ins**: Unlimited

### Optimization Tips for Free Plan:

1. **Image Optimization**:
   - Compress images before upload (recommended: < 500KB each)
   - Use WebP format when possible
   - Limit image dimensions (recommended: max 1200px width)

2. **Database Optimization**:
   - Use real-time listeners sparingly (only where needed)
   - Implement pagination for large product lists
   - Cache frequently accessed data

3. **Storage Optimization**:
   - Delete old/unused images when products are removed
   - Use appropriate image formats and compression

## 8. Security Rules (Production Ready)

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write products and categories
    match /products/{document} {
      allow read: if true; // Public read for product display
      allow write: if request.auth != null; // Only authenticated users can write
    }
    match /categories/{document} {
      allow read: if true; // Public read for categories
      allow write: if request.auth != null; // Only authenticated users can write
    }
  }
}
```

### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      allow read: if true; // Public read for product images
      allow write: if request.auth != null // Only authenticated users can upload
        && resource.size < 5 * 1024 * 1024 // Max 5MB per file
        && resource.contentType.matches('image/.*'); // Only images
    }
  }
}
```

## 9. Test the Setup

1. Start your development server: `npm run dev`
2. Go to `/admin` and try logging in with:
   - Email: `admin@houseoffestival.com`
   - Password: `admin123456`
3. Try adding a product with an image (keep it under 500KB)
4. Check your Firestore console to see the data
5. Check Storage console to see uploaded images

## 10. Monitoring Usage (Important for Free Plan)

1. Go to **Usage** tab in Firebase Console
2. Monitor your daily usage for:
   - Firestore reads/writes
   - Storage downloads/uploads
   - Storage space used

## 11. Upgrading Considerations

If you exceed free limits, consider:
- **Blaze Plan**: Pay-as-you-go pricing
- **Image CDN**: Use external image hosting for large catalogs
- **Caching**: Implement client-side caching to reduce reads

## Troubleshooting

- **Quota exceeded**: Wait for daily reset or upgrade to Blaze plan
- **Authentication errors**: Ensure admin user exists in Firebase Auth
- **Permission errors**: Check security rules are properly configured
- **Image upload errors**: Verify file size < 5MB and correct format
- **Configuration errors**: Double-check Firebase config object

## Best Practices for Free Plan

1. **Optimize Images**: Always compress before upload
2. **Monitor Usage**: Check Firebase console regularly
3. **Efficient Queries**: Use specific queries instead of fetching all data
4. **Cache Data**: Store frequently used data in component state
5. **Batch Operations**: Group multiple writes when possible

## Production Deployment Tips

1. **Environment Variables**: Use environment variables for Firebase config
2. **Security Rules**: Update to production-ready rules before going live
3. **Monitoring**: Set up usage alerts in Firebase Console
4. **Backup**: Export Firestore data regularly
5. **Performance**: Monitor app performance with Firebase Performance Monitoring (free)