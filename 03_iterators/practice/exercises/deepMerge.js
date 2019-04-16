/**
 * Реализовать метод deepMerge для рекурсивного слияния собственных и унаследованных перечислимых
 * строковых свойств исходного объекта в целевой объект.
 * Свойства исходного объекта, которые разрешаются в undefined, пропускаются,
 * если свойство существует в целевом объекте.
 * Свойства Array и plain Object типа рекурсивно объединяются, свойства других типов из исходного объекта
 * переписывают свойства в объекте назначения либо добавляются если их нету в объекте назначения
 *
 * Пример:
 *
 * const destinationObject = {
 *   students: [{ name: 'Unit 1' }, { name: 'Unit 2'}],
 *   label: 'backend',
 *   count: 1
 * };
 *
 * const sourceObject = {
 *  students: [{ surname: 'Forge 1' }, { surname: 'Forge 2'}],
 *  label: 'frontend'
 * };
 *
 * deepMerge(destinationObject, sourceObject);
 * // => {
 * //       students: [{ name: 'Unit 1', surname: 'Forge 1' }, { name: 'Unit 2', surname: 'Forge 2' }],
 * //       label: 'frontend',
 * //       count: 1
 * //    }
 */

import cloneDeep from './cloneDeep';

export default function deepMerge(destinationObject, sourceObject) {
  const isObject = obj => typeof obj === 'object';
  const isUndefined = obj => typeof obj === 'undefined';
  const isPrimitive = obj => !isObject(obj) && !isUndefined(obj);
  const isArray = obj => obj.__proto__.constructor.name.toLowerCase() === 'array';
  const getUniques = function (values) {
    const uniqueValues = [];
    values.forEach(value => {
      if (!uniqueValues.includes(value)) {
        uniqueValues.push(value);
      }
    });
    return uniqueValues;
  }
  let resultObject;
  if (isObject(destinationObject) && isObject(sourceObject)) {
    resultObject = {};
  }
  if (isArray(destinationObject) && isArray(sourceObject)) {
    resultObject = [];
  }
  const destinationKeys = Object.keys(destinationObject);
  const sourceKeys = Object.keys(sourceObject);
  const resultKeys = getUniques(destinationKeys.concat(sourceKeys));
  const mergeWithObject = (a, b) => {
    if (isObject(a) && !isObject(b)) {
      return cloneDeep(a);
    }
    if (!isObject(a) && isObject(b)) {
      return cloneDeep(b);
    }
  }
  const mergeWithPrimitive = (destination, source) => {
    if (isPrimitive(destination) && isPrimitive(source)) {
      return source;
    } else {
      if (isPrimitive(destination)) {
        return destination;
      }
      if (isPrimitive(source)) {
        return source;
      }
    }
  }
  resultKeys.forEach( key => {
    let destination = destinationObject[key];
    let source = sourceObject[key];
    if (isObject(destination) && isObject(source)) {
      resultObject[key] = deepMerge(destination, source);
    } else {
      if (isObject(destination) || isObject(source)) {
        resultObject[key] = mergeWithObject(destination, source);
      } else {
        resultObject[key] = mergeWithPrimitive(destination, source);
      }
    }
  });
  return resultObject;
}