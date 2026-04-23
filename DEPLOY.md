# Deployment Options for Pin Cards Power-Up

This guide covers how to deploy the Pin Cards Power-Up for production use. Trello Power-Ups must be hosted on a **publicly accessible HTTPS server**.

## Recommended: GitHub Pages (Free & Easy)

**Best for:** Simple, static Power-Ups like this one

### Setup Steps

1. **Create a new GitHub repository** (or use a branch in your existing repo)

2. **Push the power-up files:**
   ```bash
   cd trello-powerups/pin-cards
   git init
   git add .
   git commit -m "Initial commit: Pin Cards Power-Up"
   git remote add origin https://github.com/yourusername/trello-pin-cards.git
   git push -u origin main
   ```

3. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Settings → Pages
   - Source: main branch
   - Click Save

4. **Your Power-Up will be available at:**
   ```
   https://yourusername.github.io/trello-pin-cards/
   ```

5. **Add to Trello:**
   - Go to your Trello board → Power-Ups
   - Custom Power-Ups → New Power-Up
   - Enter: `https://yourusername.github.io/trello-pin-cards/manifest.json`

### Advantages
- ✅ Free
- ✅ Automatic HTTPS
- ✅ Easy to update (just push changes)
- ✅ Version control built-in
- ✅ No server maintenance
- ✅ Perfect for static Power-Ups

---

## Alternative Option 1: Netlify

**Best for:** Drag-and-drop simplicity

### Setup Steps

1. **Go to [Netlify](https://www.netlify.com/)**

2. **Sign up/login**

3. **Deploy:**
   - Drag and drop the `pin-cards/` folder onto Netlify
   - Or connect your GitHub repository for automatic deployments

4. **Your site will be available at:**
   ```
   https://your-site-name.netlify.app/
   ```

5. **Optional: Custom domain**
   - Settings → Domain management → Add custom domain

### Advantages
- ✅ Free tier available
- ✅ Automatic HTTPS
- ✅ Instant deployments
- ✅ Custom domain support
- ✅ No Git required (can drag & drop)

---

## Alternative Option 2: Vercel

**Best for:** Modern deployment workflow

### Setup Steps

1. **Go to [Vercel](https://vercel.com/)**

2. **Sign up/login**

3. **Deploy:**
   - Import your GitHub repository
   - Or use Vercel CLI:
     ```bash
     npm i -g vercel
     cd trello-powerups/pin-cards
     vercel
     ```

4. **Your site will be available at:**
   ```
   https://your-project-name.vercel.app/
   ```

### Advantages
- ✅ Free tier available
- ✅ Automatic HTTPS
- ✅ Git integration
- ✅ Preview deployments for PRs
- ✅ Edge network for fast global access

---

## Alternative Option 3: Google Cloud Storage + Cloud CDN

**Best for:** Integration with existing GCP infrastructure

### Setup Steps

1. **Create a GCS bucket:**
   ```bash
   gsutil mb -p se-job-to-fab-deck gs://trello-pin-cards-powerup
   ```

2. **Make bucket public:**
   ```bash
   gsutil iam ch allUsers:objectViewer gs://trello-pin-cards-powerup
   ```

3. **Upload files:**
   ```bash
   cd trello-powerups/pin-cards
   gsutil -m cp -r * gs://trello-pin-cards-powerup/
   ```

4. **Configure for web hosting:**
   ```bash
   gsutil web set -m index.html -e 404.html gs://trello-pin-cards-powerup
   ```

5. **Set CORS (required for Trello):**
   Create `cors.json`:
   ```json
   [
     {
       "origin": ["https://trello.com"],
       "method": ["GET"],
       "responseHeader": ["Content-Type"],
       "maxAgeSeconds": 3600
     }
   ]
   ```
   
   Apply CORS:
   ```bash
   gsutil cors set cors.json gs://trello-pin-cards-powerup
   ```

6. **Access via:**
   ```
   https://storage.googleapis.com/trello-pin-cards-powerup/manifest.json
   ```

7. **Optional: Set up Cloud CDN for better performance**

### Advantages
- ✅ Integrates with existing GCP setup
- ✅ Highly scalable
- ✅ Can add Cloud CDN for global performance
- ✅ Fine-grained access control

### Disadvantages
- ❌ More complex setup
- ❌ Costs (though minimal for static files)
- ❌ Requires GCP knowledge

---

## Alternative Option 4: AWS S3 + CloudFront

**Best for:** AWS users

### Setup Steps

1. **Create S3 bucket:**
   - Enable static website hosting
   - Make bucket public
   - Upload files

2. **Configure CloudFront:**
   - Create CloudFront distribution
   - Point to S3 bucket
   - Enable HTTPS

3. **Set CORS policy on S3 bucket**

4. **Access via CloudFront URL**

### Advantages
- ✅ Integrates with AWS infrastructure
- ✅ Global CDN included
- ✅ Highly scalable

### Disadvantages
- ❌ More complex setup
- ❌ Costs
- ❌ Requires AWS knowledge

---

## Production Checklist

Once deployed to any platform:

### 1. Update Manifest URL in Trello
- Use your production URL: `https://your-domain.com/manifest.json`
- Add the Power-Up to your board

### 2. Register as Official Power-Up (Optional)
- Go to https://trello.com/power-ups/admin
- Create a new Power-Up listing
- Fill in details and submit
- Can be listed in Trello's Power-Up directory

### 3. Add Icon (Recommended)
- Create a 256x256 PNG icon
- Upload to your hosting
- Update `manifest.json`:
  ```json
  "icon": {
    "url": "https://your-domain.com/icon.png"
  }
  ```

### 4. Test Thoroughly
- ✅ Test on multiple boards
- ✅ Test with different team members
- ✅ Verify HTTPS works correctly
- ✅ Test all features (pin, unpin, board button, settings)
- ✅ Check browser console for errors

### 5. Set Up Monitoring (Optional)
- Use your hosting platform's analytics
- Monitor for errors or issues
- Track usage if needed

---

## Updating Your Power-Up

### GitHub Pages / Netlify / Vercel
1. Make changes to your files
2. Commit and push to GitHub
3. Deployment happens automatically
4. Trello will use the updated files (may need to refresh)

### GCS / S3
1. Make changes to your files
2. Re-upload to bucket:
   ```bash
   gsutil -m cp -r * gs://trello-pin-cards-powerup/
   ```
3. May need to invalidate CDN cache

---

## Recommended Choice

**For this Power-Up, we recommend GitHub Pages because:**
- It's free
- Automatic HTTPS
- Easy updates via Git
- No configuration needed
- Perfect for static files
- Built-in version control

**Quick Start:**
```bash
cd trello-powerups/pin-cards
git init
git add .
git commit -m "Initial commit"
# Create repo on GitHub first, then:
git remote add origin https://github.com/yourusername/trello-pin-cards.git
git push -u origin main
# Enable GitHub Pages in repo settings
```

Then add to Trello using:
```
https://yourusername.github.io/trello-pin-cards/manifest.json
```
