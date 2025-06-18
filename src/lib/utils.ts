import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateRandomUsername(): string {
  const adjectives = [
    "Happy", "Quick", "Clever", "Brave", "Silent", "Calm", "Wild", "Bright",
    "Bold", "Swift", "Eager", "Gentle", "Cool", "Keen", "Warm", "Grand"
  ];
  
  const nouns = [
    "Wolf", "Star", "Moon", "Sun", "Eagle", "Tiger", "Panda", "Dolphin",
    "Lion", "Fox", "Bear", "Hawk", "Raven", "Owl", "Falcon", "Phoenix"
  ];
  
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 10000);
  
  return `${adjective}${noun}${number}`;
}

export async function ensureUniqueUsername(username: string, User: typeof import('@/models/User').default): Promise<string> {
  // First make sure username matches the required format
  if (!/^[a-zA-Z0-9]+$/.test(username)) {
    // Replace any invalid characters with empty string
    username = username.replace(/[^a-zA-Z0-9]/g, '');
    
    // If it's empty after removing invalid chars, generate a new one
    if (!username) {
      username = generateRandomUsername().replace(/_/g, '');
    }
  }
  
  let uniqueUsername = username;
  let isUnique = false;
  let attempts = 0;
  
  while (!isUnique && attempts < 10) {
    const existingUser = await User.findOne({ username: uniqueUsername });
    if (!existingUser) {
      isUnique = true;
    } else {
      // Add random number suffix
      uniqueUsername = `${username}${Math.floor(Math.random() * 10000)}`;
      attempts++;
    }
  }
  
  return uniqueUsername;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
}