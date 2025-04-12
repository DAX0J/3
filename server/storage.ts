import { users, type User, type InsertUser } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Site settings interface
  getSitePassword(): Promise<string>;
  checkPasswordProtectionEnabled(): Promise<boolean>;
  validatePassword(password: string): Promise<boolean>;
  setSitePassword(password: string): Promise<void>;
  setPasswordProtection(enabled: boolean): Promise<void>;
  generateSessionToken(ip: string): Promise<string>;
  validateSessionToken(token: string | undefined): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private sitePassword: string;
  private passwordProtectionEnabled: boolean;
  private validSessionTokens: Set<string>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
    this.sitePassword = 'password123'; // Default password
    this.passwordProtectionEnabled = true; // Password protection enabled by default
    this.validSessionTokens = new Set();
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Site password methods
  async getSitePassword(): Promise<string> {
    return this.sitePassword;
  }
  
  async checkPasswordProtectionEnabled(): Promise<boolean> {
    return this.passwordProtectionEnabled;
  }
  
  async validatePassword(password: string): Promise<boolean> {
    return password === this.sitePassword;
  }
  
  async setSitePassword(password: string): Promise<void> {
    this.sitePassword = password;
  }
  
  async setPasswordProtection(enabled: boolean): Promise<void> {
    this.passwordProtectionEnabled = enabled;
  }
  
  async generateSessionToken(ip: string): Promise<string> {
    // Generate a random token
    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
    // Store the token with expiration information
    this.validSessionTokens.add(token);
    return token;
  }
  
  async validateSessionToken(token: string | undefined): Promise<boolean> {
    if (!token) return false;
    return this.validSessionTokens.has(token);
  }
}

export const storage = new MemStorage();
