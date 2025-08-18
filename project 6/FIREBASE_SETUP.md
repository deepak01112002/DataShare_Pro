# Firebase Setup for XPeriodKids Project

## 1. Firebase Project Configuration ✅

Your Firebase project is already configured with:
- **Project ID**: xperiodkids
- **Auth Domain**: xperiodkids.firebaseapp.com
- **Storage Bucket**: xperiodkids.firebasestorage.app

## 2. Enable Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/project/xperiodkids)
2. Navigate to **Authentication** → **Sign-in method**
3. Enable **Email/Password** provider
4. Go to **Users** tab
5. Click **Add user** and create admin user:
   - **Email**: admin@xperiodkids.com
   - **Password**: admin123456
   - Click **Add user**

## 3. Create Firestore Database

1. Go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select a location closest to your users
5. Click **Done**

## 4. Set up Firebase Storage

1. Go to **Storage**
2. Click **Get started**
3. Choose **Start in test mode**
4. Select the same location as your Firestore
5. Click **Done**

## 5. Security Rules Setup

### Firestore Rules
Go to **Firestore Database** → **Rules** and paste:

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
Go to **Storage** → **Rules** and paste:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true; // Public read for all files
      allow write: if request.auth != null // Only authenticated users can upload
        && request.resource.size < 5 * 1024 * 1024 // Max 5MB per file
        && request.resource.contentType.matches('image/.*'); // Only images
    }
  }
}
```

**Important**: Make sure to click **Publish** after updating the rules.

## 6. Test the Setup

1. Start your development server: `npm run dev`
2. Go to `/admin` and login with:
   - Email: admin@xperiodkids.com
   - Password: admin123456
3. Try adding a product with an image
4. Check your Firestore console to see the data
5. Check Storage console to see uploaded images

## 7. Admin Features Available

### Product Management
- ✅ Add new products with images
- ✅ Edit existing products
- ✅ Delete products (with image cleanup)
- ✅ Upload images to Firebase Storage
- ✅ Real-time product updates

### Category Management
- ✅ Add new categories
- ✅ Edit category names
- ✅ Delete unused categories
- ✅ Category usage tracking

### Authentication
- ✅ Secure admin login
- ✅ Session management
- ✅ Protected admin routes

## 8. Free Plan Limits & Optimizations

### Current Limits (Free Plan)
- **Firestore**: 50K reads, 20K writes, 20K deletes per day
- **Storage**: 5GB storage, 1GB downloads per day
- **Authentication**: Unlimited users and sign-ins

### Optimization Tips
1. **Images**: Compress before upload (< 500KB recommended)
2. **Monitoring**: Check Firebase Console → Usage regularly
3. **Caching**: Products are cached in real-time listeners

## 9. Troubleshooting

### Common Issues:
- **"User not found"**: Create admin user in Firebase Authentication
- **"Permission denied"**: Check Firestore/Storage security rules
- **"Image upload failed"**: Verify file size < 5MB and correct format
- **"Quota exceeded"**: Wait for daily reset or upgrade to Blaze plan
- **"CORS error"**: Make sure Storage rules are published and allow authenticated uploads
- **"Form validation error"**: All form inputs must have name attributes

### CORS Error Fix:
If you get CORS errors when uploading images:
1. Go to **Storage** → **Rules**
2. Make sure rules allow authenticated uploads
3. Click **Publish** after updating rules
4. Wait 1-2 minutes for rules to propagate
5. Try uploading again

### Alternative: Use Image URLs
If Firebase Storage uploads continue to fail:
1. Use the "Or use an image URL instead" option
2. Paste a direct image URL (e.g., from Imgur, Cloudinary, etc.)
3. This bypasses Firebase Storage entirely

## 10. Production Deployment

When ready for production:
1. Update security rules to be more restrictive
2. Set up proper environment variables
3. Configure custom domain if needed
4. Set up monitoring and alerts
5. Consider upgrading to Blaze plan for higher limits

## Quick Start Checklist

- [ ] Create admin user in Firebase Authentication
- [ ] Enable Firestore Database
- [ ] Enable Firebase Storage
- [ ] Set up security rules
- [ ] Test admin login
- [ ] Add first product
- [ ] Verify product appears on products page

Your Firebase integration is now complete! 🎉 