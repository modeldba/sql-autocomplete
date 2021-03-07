import { SQLAutocomplete, SQLDialect, AutocompleteOption, AutocompleteOptionType } from '../dist/index';

let mysqlAutocomplete: SQLAutocomplete = null;
let plsqlAutocomplete: SQLAutocomplete = null;
let plpgsqlAutocomplete: SQLAutocomplete = null;
let tsqlAutocomplete: SQLAutocomplete = null;
beforeAll(() => {
  mysqlAutocomplete = new SQLAutocomplete(SQLDialect.MYSQL);
  plsqlAutocomplete = new SQLAutocomplete(SQLDialect.PLSQL);
  plpgsqlAutocomplete = new SQLAutocomplete(SQLDialect.PLpgSQL);
  tsqlAutocomplete = new SQLAutocomplete(SQLDialect.TSQL);
});

function containsOptionType(options: AutocompleteOption[], type: AutocompleteOptionType): boolean {
  for (const option of options) {
    if (option.optionType === type) {
      return true;
    }
  }
  return false;
}

function containsOption(options: AutocompleteOption[], type: AutocompleteOptionType, value: string): boolean {
  for (const option of options) {
    if (option.optionType === type && option.value === value) {
      return true;
    }
  }
  return false;
}

function allKeywordsBeginWith(options: AutocompleteOption[], value: string): boolean {
  value = value.toUpperCase();
  for (const option of options) {
    if (option.optionType === AutocompleteOptionType.KEYWORD && !option.value.startsWith(value)) {
      return false;
    }
  }
  return true;
}

test('autocomplete constructor options', () => {
  const autocompleterWithoutNames = new SQLAutocomplete(SQLDialect.MYSQL);
  expect(autocompleterWithoutNames.tableNames.length).toBe(0);
  expect(autocompleterWithoutNames.columnNames.length).toBe(0);
  
  const autocompleterWithNames = new SQLAutocomplete(SQLDialect.MYSQL, ['table1'], ['columnA']);
  expect(autocompleterWithNames.tableNames.length).toBe(1);
  expect(autocompleterWithNames.columnNames.length).toBe(1);
  
  // Test for a table location
  const sqlWithTable = 'SELECT * FROM t';
  const options = autocompleterWithoutNames.autocomplete(sqlWithTable, sqlWithTable.length);
  expect(containsOptionType(options, AutocompleteOptionType.TABLE)).toBeTruthy();
  expect(containsOption(options, AutocompleteOptionType.TABLE, null)).toBeTruthy();
  expect(containsOptionType(options, AutocompleteOptionType.COLUMN)).toBeFalsy();
  expect(allKeywordsBeginWith(options, 't')).toBeTruthy();

  const options2 = autocompleterWithNames.autocomplete(sqlWithTable, sqlWithTable.length);
  expect(containsOptionType(options2, AutocompleteOptionType.TABLE)).toBeTruthy();
  expect(containsOption(options2, AutocompleteOptionType.TABLE, null)).toBeFalsy();
  expect(containsOption(options2, AutocompleteOptionType.TABLE, 'table1')).toBeTruthy();
  expect(containsOptionType(options2, AutocompleteOptionType.COLUMN)).toBeFalsy();
  expect(allKeywordsBeginWith(options2, 't')).toBeTruthy();

  // Test for a table or column location
  const sqlWithColumn = 'SELECT * FROM table1 WHERE c';
  const options3 = autocompleterWithoutNames.autocomplete(sqlWithColumn, sqlWithColumn.length);
  expect(containsOptionType(options3, AutocompleteOptionType.TABLE)).toBeTruthy();
  expect(containsOption(options3, AutocompleteOptionType.TABLE, null)).toBeTruthy();
  expect(containsOptionType(options3, AutocompleteOptionType.COLUMN)).toBeTruthy();
  expect(containsOption(options3, AutocompleteOptionType.COLUMN, null)).toBeTruthy();
  expect(allKeywordsBeginWith(options3, 'c')).toBeTruthy();

  const options4 = autocompleterWithNames.autocomplete(sqlWithColumn, sqlWithColumn.length);
  expect(containsOptionType(options4, AutocompleteOptionType.TABLE)).toBeTruthy();
  expect(containsOption(options4, AutocompleteOptionType.TABLE, 'table1')).toBeFalsy();
  expect(containsOption(options4, AutocompleteOptionType.TABLE, null)).toBeTruthy();
  expect(containsOptionType(options4, AutocompleteOptionType.COLUMN)).toBeTruthy();
  expect(containsOption(options4, AutocompleteOptionType.COLUMN, 'columnA')).toBeTruthy();
  expect(allKeywordsBeginWith(options4, 'c')).toBeTruthy();
}) 

test('autocomplete detects table location', () => {
  const sql = 'SELECT * FROM t';
  const tsqlOptions = tsqlAutocomplete.autocomplete(sql, sql.length);
  expect(containsOptionType(tsqlOptions, AutocompleteOptionType.TABLE)).toBeTruthy();
  expect(containsOptionType(tsqlOptions, AutocompleteOptionType.COLUMN)).toBeFalsy();
  expect(allKeywordsBeginWith(tsqlOptions, 't')).toBeTruthy();
  const mysqlOptions = mysqlAutocomplete.autocomplete(sql, sql.length);
  expect(containsOptionType(mysqlOptions, AutocompleteOptionType.TABLE)).toBeTruthy();
  expect(containsOptionType(mysqlOptions, AutocompleteOptionType.COLUMN)).toBeFalsy();
  expect(allKeywordsBeginWith(mysqlOptions, 't')).toBeTruthy();
  const plsqlOptions = plsqlAutocomplete.autocomplete(sql, sql.length);
  expect(containsOptionType(plsqlOptions, AutocompleteOptionType.TABLE)).toBeTruthy();
  expect(containsOptionType(plsqlOptions, AutocompleteOptionType.COLUMN)).toBeFalsy();
  expect(allKeywordsBeginWith(plsqlOptions, 't')).toBeTruthy();
  const plpgsqlOptions = plpgsqlAutocomplete.autocomplete(sql, sql.length);
  expect(containsOptionType(plpgsqlOptions, AutocompleteOptionType.TABLE)).toBeTruthy();
  expect(containsOptionType(plpgsqlOptions, AutocompleteOptionType.COLUMN)).toBeFalsy();
  expect(allKeywordsBeginWith(plpgsqlOptions, 't')).toBeTruthy();
});

test('autocomplete detects column location', () => {
  const sql = 'SELECT * FROM table1 WHERE c';
  const tsqlOptions = tsqlAutocomplete.autocomplete(sql, sql.length);
  expect(containsOptionType(tsqlOptions, AutocompleteOptionType.TABLE)).toBeTruthy();
  expect(containsOptionType(tsqlOptions, AutocompleteOptionType.COLUMN)).toBeTruthy();
  expect(allKeywordsBeginWith(tsqlOptions, 'c')).toBeTruthy();
  const mysqlOptions = mysqlAutocomplete.autocomplete(sql, sql.length);
  expect(containsOptionType(mysqlOptions, AutocompleteOptionType.TABLE)).toBeTruthy();
  expect(containsOptionType(mysqlOptions, AutocompleteOptionType.COLUMN)).toBeTruthy();
  expect(allKeywordsBeginWith(mysqlOptions, 'c')).toBeTruthy();
  const plsqlOptions = plsqlAutocomplete.autocomplete(sql, sql.length);
  expect(containsOptionType(plsqlOptions, AutocompleteOptionType.TABLE)).toBeTruthy();
  expect(containsOptionType(plsqlOptions, AutocompleteOptionType.COLUMN)).toBeTruthy();
  expect(allKeywordsBeginWith(plsqlOptions, 'c')).toBeTruthy();
  const plpgsqlOptions = plpgsqlAutocomplete.autocomplete(sql, sql.length);
  expect(containsOptionType(plpgsqlOptions, AutocompleteOptionType.TABLE)).toBeTruthy();
  expect(containsOptionType(plpgsqlOptions, AutocompleteOptionType.COLUMN)).toBeTruthy();
  expect(allKeywordsBeginWith(plpgsqlOptions, 'c')).toBeTruthy();
});

test('autocomplete next word', () => {
  const sql = 'SELECT ';
  const tsqlOptions = tsqlAutocomplete.autocomplete(sql);
  expect(containsOptionType(tsqlOptions, AutocompleteOptionType.TABLE)).toBeTruthy();
  expect(containsOptionType(tsqlOptions, AutocompleteOptionType.COLUMN)).toBeTruthy();
  const mysqlOptions = mysqlAutocomplete.autocomplete(sql);
  expect(containsOptionType(mysqlOptions, AutocompleteOptionType.TABLE)).toBeTruthy();
  expect(containsOptionType(mysqlOptions, AutocompleteOptionType.COLUMN)).toBeTruthy();
  const plsqlOptions = plsqlAutocomplete.autocomplete(sql);
  expect(containsOptionType(plsqlOptions, AutocompleteOptionType.TABLE)).toBeTruthy();
  expect(containsOptionType(plsqlOptions, AutocompleteOptionType.COLUMN)).toBeTruthy();
  const plpgsqlOptions = plpgsqlAutocomplete.autocomplete(sql);
  expect(containsOptionType(plpgsqlOptions, AutocompleteOptionType.TABLE)).toBeTruthy();
  expect(containsOptionType(plpgsqlOptions, AutocompleteOptionType.COLUMN)).toBeTruthy();
});
  
test('autocomplete when position is not provided', () => {
  const sql = 'SELECT * FR';
  const tsqlOptions = tsqlAutocomplete.autocomplete(sql);
  expect(containsOptionType(tsqlOptions, AutocompleteOptionType.TABLE)).toBeFalsy();
  expect(containsOptionType(tsqlOptions, AutocompleteOptionType.COLUMN)).toBeFalsy();
  expect(allKeywordsBeginWith(tsqlOptions, 'FR')).toBeTruthy();
  const mysqlOptions = mysqlAutocomplete.autocomplete(sql);
  expect(containsOptionType(mysqlOptions, AutocompleteOptionType.TABLE)).toBeFalsy();
  expect(containsOptionType(mysqlOptions, AutocompleteOptionType.COLUMN)).toBeFalsy();
  expect(allKeywordsBeginWith(mysqlOptions, 'FR')).toBeTruthy();
  const plsqlOptions = plsqlAutocomplete.autocomplete(sql);
  expect(containsOptionType(plsqlOptions, AutocompleteOptionType.TABLE)).toBeFalsy();
  expect(containsOptionType(plsqlOptions, AutocompleteOptionType.COLUMN)).toBeFalsy();
  expect(allKeywordsBeginWith(plsqlOptions, 'FR')).toBeTruthy();
  const plpgsqlOptions = plpgsqlAutocomplete.autocomplete(sql);
  expect(containsOptionType(plpgsqlOptions, AutocompleteOptionType.TABLE)).toBeFalsy();
  expect(containsOptionType(plpgsqlOptions, AutocompleteOptionType.COLUMN)).toBeFalsy();
  expect(allKeywordsBeginWith(plpgsqlOptions, 'FR')).toBeTruthy();
});