import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'lh3.googleusercontent.com',  // Google profile pictures
      'storage.googleapis.com',     // In case Google changes URL format
      'avatars.githubusercontent.com',  // GitHub profile pictures
      'ui-avatars.com',            // For fallback avatar generation
      'res.cloudinary.com'         // For Cloudinary (if used)
    ],
  },
  experimental: {
    serverActions: {},
  },
};

export default nextConfig;