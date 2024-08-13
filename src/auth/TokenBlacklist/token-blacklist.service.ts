import { Injectable } from '@nestjs/common';

@Injectable()
// TODO: use redis, this will not work when restart the app.
export class TokenBlacklistService {
  private static instance: TokenBlacklistService;
  private blacklist: Set<string> = new Set();

  constructor() {
    if (!TokenBlacklistService.instance) {
      TokenBlacklistService.instance = this;
    }

    return TokenBlacklistService.instance;
  }

  addToBlacklist(token: string): void {
    this.blacklist.add(token);
  }

  isBlacklisted(token: string): boolean {
    return this.blacklist.has(token);
  }

  getBlackListedTokens(): Set<string> {
    return this.blacklist;
  }
}
