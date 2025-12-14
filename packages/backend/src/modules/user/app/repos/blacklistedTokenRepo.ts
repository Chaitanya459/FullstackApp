export interface IBlacklistedTokenRepo {
  getTokens(userId: number): Promise<string[]>;
  addToList(userId: number, token: string): Promise<void>;
}
export const IBlacklistedTokenRepo = Symbol.for(`IBlacklistedTokenRepo`);
