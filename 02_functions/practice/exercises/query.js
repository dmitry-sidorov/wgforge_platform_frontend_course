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



export default function query(tableName = null, options = {}) {
  const isObject = value => typeof value === 'object';
  const isNull = value => value === null;
  if (isObject(tableName) && !isNull(tableName)) {
    options = tableName;
    tableName = null;
  }
 
  function Query(tableName, options) {
    let queryText = [];
    let hasWhereOperator = false;
    let hasSelectOperator = false;
    let hasFromOperator = false;
    let predefineTableName = false;
    if (tableName !== null) {
      predefineTableName = true;
    }
    const isQuery = obj => obj instanceof Query;
    const handleSubQuery = (subQuery, callback = escapeNames) => {
        let result;
      if (isQuery(subQuery)) {
        result = '(' + subQuery.toString().slice(0, -1) + ')';
      } else {
        result = callback(subQuery, escapeQuotes);
      }
      return result;
    } 
    const escape = (value, escapeChar) => {
      if (isString(value)) {
        return `${escapeChar}${value}${escapeChar}`;
      } else {
        return value;
      }
    }
    const isString = value => typeof value === 'string';
    const escapeQuotes = value => escape(value, '\'');
    const escapeDoubleQuotes = value => escape(value, '\"');
    const defaultCallback = value => value;
    const escapeNames = (value, callback = defaultCallback) => {
      if (options.escapeNames) {
        return escapeDoubleQuotes(value)
      } else {
        return callback(value);
      }
    }
    const escapeNamesInArray = items => {
      let escapedValues = items.map(value => escapeNames(value, escapeQuotes))
      return `(${escapedValues.join(', ')})`;
    }

    function WhereObject(context) {
      const switchNOT = function() {
        let NOTPosition = queryText.length - 2;
        if (queryText[NOTPosition] === 'NOT') {
          queryText.splice(NOTPosition, 1);
          return true;
        } else {
          return false;
        }
      } 

      this.equals = function (value) {
        queryText.push('=', handleSubQuery(value));
        return context;
      }

      this.in = function(values) {
        let result = handleSubQuery(values, escapeNamesInArray);
        if (switchNOT()) {
          queryText.push('NOT', 'IN', result);
        } else {
          queryText.push('IN', result);
        }
        return context;
      }

      this.gt = function (value) {
        queryText.push('>', handleSubQuery(value));
        return context;
      }

      this.gte = function (value) {
        queryText.push('>=', handleSubQuery(value));
        return context;
      }

      this.lt = function (value) {
        queryText.push('<', handleSubQuery(value));
        return context;
      }

      this.lte = function (value) {
        queryText.push('<=', handleSubQuery(value));
        return context;
      }

      this.between = function (minValue, maxValue) {
        queryText.push('BETWEEN', minValue, 'AND', maxValue);
        return context;
      }
      this.isNull = function () {
        if (switchNOT()) {
          queryText.push('IS', 'NOT', 'NULL');
        } else {
          queryText.push('IS NULL');
        }
        return context;
      }
      this.not = function () {
        let lastIndex = queryText.length - 1;
        let lastElement = queryText[lastIndex];
        if (lastElement === 'NOT') {
          throw new Error(">>> .not() can't be called multiple times in a row ");
        }
        queryText.splice(lastIndex, 0, 'NOT');
        return this;
      }
    }

    this.select = function(...selectors) {
        if (selectors.some(selector => !isString(selector))) {
          throw new TypeError(">>> .select() => arguments should be strings");
        }
        let cache = [];
        if (hasFromOperator && predefineTableName) {
          const queryTextLength = queryText.length;
          for (let i = 0; i < queryTextLength; i++) {
            cache.unshift(queryText.pop());
          }
        }
        if (!hasSelectOperator) {
          queryText.push('SELECT');
          hasSelectOperator = true;
          if (selectors.length === 0) {
            queryText.push('*');
          } else {
            queryText.push(selectors.map(selector => escapeNames(selector)).join(', '));
          }
        }
        if (hasFromOperator && predefineTableName) {
          cache.forEach(item => queryText.push(item));
        }
        return this;
      }

    this.from = function(tableName) {
        if (!isString(tableName)) {
          throw new TypeError(">>> .from() => argument should be a string");
        }
        if (!hasFromOperator) {
          queryText.push('FROM');
          queryText.push(escapeNames(tableName));
          hasFromOperator = true;
        }
        return this;
      }

      if (predefineTableName) {
        this.from(tableName);
      }
  
    this.where = function(condition) {
      if (hasFromOperator) {
        if (hasWhereOperator) {
          queryText.push('AND', condition);
        } else {
          queryText.push('WHERE', condition);
          hasWhereOperator = true;
        }
      }
      return new WhereObject(this);
    }

    this.orWhere = function(condition) {
      if (hasWhereOperator) {
        queryText.push('OR', condition);
      } else {
        queryText.push('WHERE', condition);
        hasWhereOperator = true;
      }
      return new WhereObject(this);
    }

    this.toString = function () {
      return queryText.join(' ').concat(';');
    }

  }
  return new Query(tableName, options);
}


