/**
 * Session Persistence Service
 * Manages terminal and IDE session state in Redis
 */

import { getRedisClient } from './redis';
import type { TerminalSessionState, IDESessionState, SessionMetadata } from '@/types/session';

const SESSION_TTL = 3600; // 1 hour
const TERMINAL_SESSION_PREFIX = 'terminal:session:';
const IDE_SESSION_PREFIX = 'ide:session:';
const SESSION_METADATA_PREFIX = 'session:meta:';

export class SessionService {
  /**
   * Save terminal session state
   */
  async saveTerminalSession(state: TerminalSessionState): Promise<boolean> {
    const client = await getRedisClient();
    if (!client) return false;

    try {
      const key = `${TERMINAL_SESSION_PREFIX}${state.sessionId}`;
      await client.setEx(key, SESSION_TTL, JSON.stringify(state));
      
      // Update metadata
      await this.updateSessionMetadata({
        sessionId: state.sessionId,
        userId: state.userId,
        type: 'terminal',
        lastActivity: state.lastActivity,
        createdAt: state.createdAt,
        ttl: SESSION_TTL
      });

      return true;
    } catch (error) {
      console.error('Failed to save terminal session:', error);
      return false;
    }
  }

  /**
   * Load terminal session state
   */
  async loadTerminalSession(sessionId: string): Promise<TerminalSessionState | null> {
    const client = await getRedisClient();
    if (!client) return null;

    try {
      const key = `${TERMINAL_SESSION_PREFIX}${sessionId}`;
      const data = await client.get(key);
      if (!data) return null;

      const state = JSON.parse(data) as TerminalSessionState;
      
      // Update last activity
      state.lastActivity = Date.now();
      await this.saveTerminalSession(state);

      return state;
    } catch (error) {
      console.error('Failed to load terminal session:', error);
      return null;
    }
  }

  /**
   * Save IDE session state
   */
  async saveIDESession(state: IDESessionState): Promise<boolean> {
    const client = await getRedisClient();
    if (!client) return false;

    try {
      const key = `${IDE_SESSION_PREFIX}${state.sessionId}`;
      await client.setEx(key, SESSION_TTL, JSON.stringify(state));
      
      // Update metadata
      await this.updateSessionMetadata({
        sessionId: state.sessionId,
        userId: state.userId,
        type: 'ide',
        lastActivity: state.lastActivity,
        createdAt: state.createdAt,
        ttl: SESSION_TTL
      });

      return true;
    } catch (error) {
      console.error('Failed to save IDE session:', error);
      return false;
    }
  }

  /**
   * Load IDE session state
   */
  async loadIDESession(sessionId: string): Promise<IDESessionState | null> {
    const client = await getRedisClient();
    if (!client) return null;

    try {
      const key = `${IDE_SESSION_PREFIX}${sessionId}`;
      const data = await client.get(key);
      if (!data) return null;

      const state = JSON.parse(data) as IDESessionState;
      
      // Update last activity
      state.lastActivity = Date.now();
      await this.saveIDESession(state);

      return state;
    } catch (error) {
      console.error('Failed to load IDE session:', error);
      return null;
    }
  }

  /**
   * Update session metadata
   */
  private async updateSessionMetadata(metadata: SessionMetadata): Promise<void> {
    const client = await getRedisClient();
    if (!client) return;

    try {
      const key = `${SESSION_METADATA_PREFIX}${metadata.sessionId}`;
      await client.setEx(key, metadata.ttl || SESSION_TTL, JSON.stringify(metadata));
    } catch (error) {
      console.error('Failed to update session metadata:', error);
    }
  }

  /**
   * Get session metadata
   */
  async getSessionMetadata(sessionId: string): Promise<SessionMetadata | null> {
    const client = await getRedisClient();
    if (!client) return null;

    try {
      const key = `${SESSION_METADATA_PREFIX}${sessionId}`;
      const data = await client.get(key);
      if (!data) return null;

      return JSON.parse(data) as SessionMetadata;
    } catch (error) {
      console.error('Failed to get session metadata:', error);
      return null;
    }
  }

  /**
   * Delete session
   */
  async deleteSession(sessionId: string, type: 'terminal' | 'ide'): Promise<boolean> {
    const client = await getRedisClient();
    if (!client) return false;

    try {
      const prefix = type === 'terminal' ? TERMINAL_SESSION_PREFIX : IDE_SESSION_PREFIX;
      const key = `${prefix}${sessionId}`;
      const metadataKey = `${SESSION_METADATA_PREFIX}${sessionId}`;
      
      await Promise.all([
        client.del(key),
        client.del(metadataKey)
      ]);

      return true;
    } catch (error) {
      console.error('Failed to delete session:', error);
      return false;
    }
  }

  /**
   * Clean up expired sessions
   */
  async cleanupExpiredSessions(): Promise<number> {
    const client = await getRedisClient();
    if (!client) return 0;

    try {
      // Get all session metadata keys
      const pattern = `${SESSION_METADATA_PREFIX}*`;
      const keys = await client.keys(pattern);
      
      let cleaned = 0;
      for (const key of keys) {
        const data = await client.get(key);
        if (!data) {
          await client.del(key);
          cleaned++;
          continue;
        }

        const metadata = JSON.parse(data) as SessionMetadata;
        const age = Date.now() - metadata.lastActivity;
        
        // Delete if inactive for more than TTL
        if (age > (metadata.ttl || SESSION_TTL) * 1000) {
          const sessionId = key.replace(SESSION_METADATA_PREFIX, '');
          const sessionType = metadata.type;
          await this.deleteSession(sessionId, sessionType);
          cleaned++;
        }
      }

      return cleaned;
    } catch (error) {
      console.error('Failed to cleanup expired sessions:', error);
      return 0;
    }
  }

  /**
   * Rate limiting: Check if session has exceeded rate limit
   */
  async checkRateLimit(sessionId: string, maxRequests: number = 100, windowMs: number = 60000): Promise<{ allowed: boolean; remaining: number }> {
    const client = await getRedisClient();
    if (!client) return { allowed: true, remaining: maxRequests };

    try {
      const key = `ratelimit:${sessionId}`;
      const current = await client.incr(key);
      
      if (current === 1) {
        await client.expire(key, Math.ceil(windowMs / 1000));
      }

      const remaining = Math.max(0, maxRequests - current);
      return {
        allowed: current <= maxRequests,
        remaining
      };
    } catch (error) {
      console.error('Rate limit check failed:', error);
      return { allowed: true, remaining: maxRequests };
    }
  }
}

// Singleton instance
export const sessionService = new SessionService();

