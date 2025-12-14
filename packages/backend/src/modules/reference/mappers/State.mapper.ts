import { StateDTO } from 'rsd';
import { IState } from 'types';
import morphism, { createSchema } from 'morphism';

export class StateMapper {
  public static toDomain(data: StateDTO): IState {
    const schema = createSchema<IState, StateDTO>({
      id: `id`,
      code: `code`,
      name: `name`,
    });

    return morphism(schema, data);
  }

  public static toDTO(data: IState): StateDTO {
    const schema = createSchema<StateDTO, IState>({
      id: `id`,
      code: `code`,
      name: `name`,
    });

    return morphism(schema, data);
  }
}
