/**
 * Задача 1: написать функцию smoosh, которая принимает массив, "выравнивает" вложенные массивы
 * в одноуровневый массив и возвращает новый плоский массив.
 * Например:
 * smoosh([1, 2, [3, 4], 5])
 * > [1, 2, 3, 4, 5]
 * Входной массив может содержать массивы любого уровня вложенности.
 * Например: [[1, 2], [3, [4, [5]]]]
 *
 * Задача 2: написать функцию squeeze (по аналогии со smoosh) таким образом,
 * чтобы она модифицировала исходный массив, а не возвращала новый.
 *
 * Задача 3*: для функций smoosh и squeeze добавить валидацию входного параметра.
 * В случае, если на вход передан не массив функция должна выбросить исключение
 * с сообщением 'argument should be an array'.
 */

function smoosh(array) {
  const errorMessage = 'argument should be an array';
  if (!(array instanceof Array)) {
    throw { message: 'argument should be an array' };
  }
  const result = [];
  function inspect(array) {
    array.forEach((item, i) => {
      if (item instanceof Array) {
        inspect(item);
      } else {
        result.push(item);
      }
    });
  }
  inspect(array);
  return result;
}

function squeeze(array) {
  let result = smoosh(array);
  const len = array.length;
  for (let i = 0; i < len; i++) {
    array.pop();
  }
  result.forEach(item => {
    array.push(item);
  });
  return array;
}

export { smoosh, squeeze };
