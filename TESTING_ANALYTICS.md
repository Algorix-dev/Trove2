# Quick Testing Instructions

## Current Behavior
- Reading sessions are created every **60 seconds** (1 minute)
- This is realistic for production use

## If You Want to Test Faster

Temporarily change the interval in all 3 viewer files to 10 seconds:

### Files to change:
1. `components/features/reader/pdf-viewer.tsx` - Line ~96
2. `components/features/reader/epub-viewer.tsx` - Line ~159  
3. `components/features/reader/txt-viewer.tsx` - Line ~67

### Change this:
```tsx
}, 60000) // Every minute
```

### To this:
```tsx
}, 10000) // Every 10 seconds (FOR TESTING ONLY)
```

This will create reading sessions every 10 seconds instead of 60.

**Remember to change it back to 60000 after testing!**

## Or Just Wait

The production version (60 seconds) is already deployed. Just:
1. Open a book
2. Wait 1-2 minutes
3. Check analytics
4. Should show data!
