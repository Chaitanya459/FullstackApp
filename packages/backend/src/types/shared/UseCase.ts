import { ActorId } from './ActorId';

export interface IUseCase<InputType, ReturnType> {
  execute(input: InputType, actorId: ActorId): Promise<ReturnType>;
}
