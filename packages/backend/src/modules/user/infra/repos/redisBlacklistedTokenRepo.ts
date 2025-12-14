import { injectable } from 'inversify';
import { redisClient } from '../../../../infra/database/redis/redisClient';
import { IBlacklistedTokenRepo } from '../../app/repos';

@injectable()
export class BlacklistedTokenRepo implements IBlacklistedTokenRepo {
  public async getTokens(userId: number): Promise<string[]> {
    const result = await redisClient.sMembers(`${userId}-resetPasswordToken`);
    if (Array.isArray(result)) {
      return result.map((item) => item instanceof Buffer ? item.toString() : String(item));
    } else if (result instanceof Set) {
      return Array.from(result).map((item) => item instanceof Buffer ? item.toString() : String(item));
    }
    return [];
  }

  public async addToList(userId: number, token: string) {
    await redisClient.sAdd(`${userId}-resetPasswordToken`, token);
    await redisClient.expire(`${userId}-resetPasswordToken`, 60 * 60);
  }
}
