/**
 * Реализовать функцию cloneDeep которая копирует объекты по значению с любой глубиной вложенности
 */
export default function cloneDeep(sourceObject) {
  const isObject = obj => obj.__proto__.constructor.name.toLowerCase() === 'object';
  let clonedObject;
  if (isObject(sourceObject)) {
    clonedObject = {};
  } else {
    if (Array.isArray(sourceObject)) {
      clonedObject = [];
    } else {
      return sourceObject;
    }
  }
  for (let i in sourceObject) {
    clonedObject[i] = cloneDeep(sourceObject[i]);
  }
  return clonedObject;
}
