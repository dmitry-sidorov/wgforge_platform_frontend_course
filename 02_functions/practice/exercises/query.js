/**
 * Задание: написать построитель SQL-запросов.
 * Данный модуль должен экспортировать функцию `query`, вызов которой должен возвращать новый экземпляр объекта query.
 * Например:
 * const q1 = query();
 * const q2 = query();
 * console.log(Object.is(q1, q2)) // false
 *
 * В качестве аргументов query может передаваться имя таблицы.
 * Тогда при дальнейшем составлении запроса вызовы метода from(tableName) игнорируются.
 *
 * У возвращаемого объекта должны быть следующие методы:
 *
 * select(arg1, arg2 ... argN) - может принимать список полей для выборки.
 * Аргументы должны иметь тип String. Если ни одного аргумента не передано должны быть получены все поля таблицы
 * Например:
 * q.select().from('users')
 * > SELECT * FROM users
 * q.select('id', 'name').from('users')
 * > SELECT id, name FROM users
 *
 * from(tableName: String) - указывает из какой таблицы получать данные.
 *
 * where(fieldName: String) - служит для задания условия фильтрации.
 * При множественном вызове метода where в одном запросе условия должны объединяться через логическое "И".
 * Метод where должен возвращать объект имеющий следующие методы:
 * orWhere(fieldName: String) - делает то же самое что where, но объединяет через "ИЛИ".
 * Метод where должен возвращать объект имеющий следующие методы:
 *
 * equals(value: any) - условие равенства
 * Например: SELECT * FROM student WHERE age = 42;
 *
 * in(values: array) - позволяет определить, совпадает ли значение объекта со значением в списке
 * Например: SELECT * FROM offices WHERE city IN ('Minsk', 'Nicosia', 'Seattle');
 *
 * gt(value: any) - условие больше '>'
 * gte(value: any) - условие больше или равно '>='
 * lt(value: any) -  условие меньше '<'
 * lte(value: any) -  условие меньше или равно '<='
 * between(from: any, to: any) -  условие нахождения значения поля в заданном диапазоне:
 * SELECT * FROM products WHERE price BETWEEN 4.95 AND 9.95;
 *
 * isNull() - условие отсутствия значения у поля
 *
 * not() - служит для задания противоположного.
 * После вызова not можно вызывать только те же методы, которые использует where для сравнения.
 *
 * q.select().from('users').where('name').not().equals('Vasya')
 *
 * Вызов not не может быть вызван более одного раза подряд:
 * q.select().from('users').where('name').not().not().equals('Vasya')
 *
 * Внимание: методы сравнения не могут быть вызваны до вызова метода where()!
 *
 * Получения строчного представления сконструированного SQL-запроса должно происходить при
 * вызове метода toString() у объекта query.
 * В конце строки SQL-запроса должен быть символ ';'
 *
 * Дополнительные задания:
 *
 * 1. Добавить в сигнатуру функии query второй опциональный аргумент options типа Object.
 * Если в options есть поле escapeNames со значением true, названия полей и таблиц должны быть обёрнуты в двойные кавычки:
 *
 * const q = query({escapeNames: true});
 * q.select('name').from('people').toString()
 * > SELECT "name" FROM "people";

 * const q = query('books', {escapeNames: true});
 * q.select('title').toString()
 * > SELECT "title" FROM "books";
 *
 * 2. Добавить возможность передавать в условия методов сравнения в качестве значения экземпляр запроса query.
 *
 * const q1 = query('users');
 * const admins = q1.select('id').where('role').equals('admin');
 * const q2 = query('posts');
 * const posts = q2.select().where('author_id').in(admins);
 * posts.toString();
 * > SELECT * FROM posts WHERE author_id IN (SELECT id FROM users WHERE role = 'admin');
 *
 * 3. Реализовать функциональность создания INSERT и DELETE запросов. Написать для них тесты.
 */

export default 
function query() {

  function Query() {
    const queryText = [];
    let whereUsed = false;
    const isString = str => typeof str === 'string';

    const makeWhereObject = (that) => {
      return {
        equals: function (value) {
          queryText.push('=', value);
          console.log('this in equals => ', this);
          console.log('queryText in equals => ', queryText);
          console.log('that in equals => ', that);
          return that;
        },
        in: function (values) {
          queryText.push('IN', `(${values.split(', ')})`);
          return this;
        },
        gt: function (value) {
          queryText.push('>', value);
          return this;
        },
        gte: function (value) {
          queryText.push('>=', value);
          return this;
        },
        lt: function (value) {
          queryText.push('<', value);
          return this;
        },
        lte: function (value) {
          queryText.push('<=', value);
          return this;
        },
        between: function (minValue, maxValue) {
          queryText.push('BETWEEN', minValue, 'AND', maxValue);
          return this;
        },
        isNull: function () {
          queryText.push('IS NULL');
          return this;
        },
        not: function (value) {
          if (queryText[queryText.length - 1] !== 'NOT') {
            queryText.push('NOT');
          }
          return this;
        }
      }
    }

  this.toString = () => {
    // let queryString = this.queryText.join(' ');
    // this.queryText = [];
    // return queryString;
    return queryText.join(' ');
  }

  this.select = (...selectors) => {
      if (selectors.some(selector => !isString(selector))) {
        throw new TypeError(">>> .select() => arguments should be strings");
      }
      queryText.push('SELECT');
      if (selectors.length === 0) {
        queryText.push('*');
      } else {
        queryText.push(selectors.join(', '));
      }
      console.log('this in select() =>', this);
      return this;
    };

  this.from = tableName => {
      if (!isString(tableName)) {
        throw new TypeError(">>> .from() => argument should be a string");
      }
      queryText.push('FROM');
      queryText.push(tableName);
      return this;
    };
  
    // ['equals', 'in', 'gt', 'gte', 'lt', 'lte', 'between', 'isNull', 'not'];
    this.where = condition => {
      if (whereUsed) {
        queryText.push('AND', 'WHERE', condition);
      } else {
        queryText.push('WHERE', condition);
      }
      console.log('this in where => ', this);
      return makeWhereObject(this);
    };

    this.orWhere = condition => {
      if (whereUsed) {
        queryText.push('OR', 'WHERE', condition);
      }
      return makeWhereObject(this);
    }

  
    //====
  }
  return new Query();
}
// const q = query();
// console.log('q => ', q);
// console.log('q.select() => ', q.select().toString());
// console.log(q.select('id').from('students').where('age').equals('25'));

