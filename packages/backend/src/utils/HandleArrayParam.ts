import arrify from 'arrify';

export function handleArrayParam<T>(value: T) {
  return value ? arrify(value) : undefined;
}
