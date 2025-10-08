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

# Next.js Environment
NODE_ENV=development
```

## Important Notes:

1. **MONGODB_URI**: This should be your MongoDB Atlas connection string. You mentioned it's stored in `config.env` under `ATLAS_URI`. Copy that value here.

2. **JWT_SECRET**: In production, use a secure random string. Never share this publicly.

3. **File Location**: The `.env.local` file should be in the root directory (same level as package.json)

4. **Git**: Make sure `.env.local` is in your `.gitignore` file (it already should be by default in Next.js projects)

## Generating a Secure JWT Secret

Run this command in your terminal to generate a secure random string:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and use it as your JWT_SECRET value.
