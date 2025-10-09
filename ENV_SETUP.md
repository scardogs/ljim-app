# Environment Variables Setup

Create a `.env.local` file in the root directory of your project with the following variables:

```env
# MongoDB Connection String
# Replace with your actual MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ljim?retryWrites=true&w=majority

# JWT Secret Key
# Generate a secure random string for production
# You can use: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Base URL (OPTIONAL - Auto-detected if not set)
# Only set this if you need to override the automatic URL detection
# Local: http://localhost:3000
# Production: https://your-domain.vercel.app
# NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app

# Next.js Environment
NODE_ENV=development
```

## Important Notes:

1. **MONGODB_URI**: This should be your MongoDB Atlas connection string. You mentioned it's stored in `config.env` under `ATLAS_URI`. Copy that value here.

2. **JWT_SECRET**: In production, use a secure random string. Never share this publicly.

3. **NEXT_PUBLIC_BASE_URL**: ⚡ **OPTIONAL** - The system automatically detects the URL from request headers. Only set this if you need to override the automatic detection (e.g., custom domain routing).

4. **File Location**: The `.env.local` file should be in the root directory (same level as package.json)

5. **Git**: Make sure `.env.local` is in your `.gitignore` file (it already should be by default in Next.js projects)

## Generating a Secure JWT Secret

Run this command in your terminal to generate a secure random string:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and use it as your JWT_SECRET value.

## Deployment to Vercel

When deploying to Vercel, add these environment variables in your Vercel project settings:

1. Go to your Vercel project → Settings → Environment Variables
2. Add the following:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your secure JWT secret
   - `NEXT_PUBLIC_BASE_URL`: (Optional) Your production URL (e.g., `https://ljim.vercel.app`)

**Note:** The registration approval links will automatically use your Vercel domain without setting `NEXT_PUBLIC_BASE_URL`. The system detects the URL from request headers (`x-forwarded-host`), which Vercel provides automatically.

### How Dynamic URL Detection Works:

The system generates approval links using this priority:

1. `NEXT_PUBLIC_BASE_URL` environment variable (if set)
2. Auto-detected from request headers:
   - Protocol: `x-forwarded-proto` (https on Vercel)
   - Host: `x-forwarded-host` or `host` header (your-app.vercel.app)
3. Fallback: `http://localhost:3000` (development only)

This means your approval links will automatically be:

- **Local Development**: `http://localhost:3000/register/complete?token=...`
- **Vercel Production**: `https://your-app.vercel.app/register/complete?token=...`
- **Custom Domain**: `https://yourdomain.com/register/complete?token=...`
