/**
 * Реализовать функцию cloneDeep которая копирует объекты по значению с любой глубиной вложенности
 */
export default function cloneDeep(sourceObject) {
  // lifehack =)))
  // return JSON.parse(JSON.stringify(sourceObject));

  const isObject = obj => obj.__proto__.constructor.name.toLowerCase() === 'object';
  const isArray = obj => obj.__proto__.constructor.name.toLowerCase() === 'array';
  let clonedObject;
  if (isObject(sourceObject)) {
    clonedObject = {};
  } else {
    if (isArray(sourceObject)) {
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
