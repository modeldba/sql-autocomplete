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

function containsOptionType(options: AutocompleteOption[], type: AutocompleteOptionType) {
  for (const option of options) {
    if (option.optionType === type) {
      return true;
    }
  }
  return false;
}

function allKeywordsBeginWith(options: AutocompleteOption[], value: string) {
  value = value.toUpperCase();
  for (const option of options) {
    if (option.optionType === AutocompleteOptionType.KEYWORD && !option.value.startsWith(value)) {
      return false;
    }
  }
  return true;
}

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
  
test('autocomplete when position is not provided', () => {
  const sql = 'SELECT * FR';
  const tsqlOptions = tsqlAutocomplete.autocomplete(sql);
  expect(containsOptionType(tsqlOptions, AutocompleteOptionType.TABLE)).toBeTruthy();
  expect(containsOptionType(tsqlOptions, AutocompleteOptionType.COLUMN)).toBeTruthy();
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