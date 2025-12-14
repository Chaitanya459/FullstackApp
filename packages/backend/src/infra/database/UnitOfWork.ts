import { Sequelize, Transaction as SequelizeTransaction } from 'sequelize';

export type Transaction = SequelizeTransaction;

export class UnitOfWork {
  private transaction: Transaction;

  public constructor(
    private sequelize: Sequelize,
  ) {}

  public async begin(): Promise<Transaction> {
    this.transaction = await this.sequelize.transaction();
    return this.transaction;
  }

  public async commit(): Promise<void> {
    await this.transaction.commit();
  }

  public async rollback(): Promise<void> {
    await this.transaction.rollback();
  }
}
