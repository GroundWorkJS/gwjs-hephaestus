import 'express-serve-static-core';

declare global {
  namespace Express {
    // Passport attaches a User object with these properties to req.user
    interface User {
      id: string;
      email?: string;
      firstName?: string;
      lastName?: string;
      displayName?: string;
      provider?: string;
      createdAt?: Date;
      updatedAt?: Date;
      lockUntil?: Date | null;
      failedLoginAttempts?: number;
      isActive?: boolean;
      isVerified?: boolean;
      // 3E.8: password intentionally excluded from Express User type
      avatarUrl?: string;
    }
  }
}

export {};
