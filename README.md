# sql-autocomplete

Generate valid autocomplete suggestions for keywords, tables, or columns.

Supports MySQL, T-SQL (SQL Server), PL/pgSQL (PostgreSQL) and PL/SQL (Oracle) dialects.

## Install
```shell
npm install sql-autocomplete
```

## [Full documentation can be found here](https://modeldba.com/sql-autocomplete/docs/)

## Get Started

```typescript
import { SQLAutocomplete, SQLDialect } from 'sql-autocomplete';

const sqlAutocomplete = new SQLAutocomplete(SQLDialect.MYSQL,
                                            ['myDatabaseTableName'], // Optional
                                            ['aColumnName']);        // Optional
const sql1 = 'SELECT * FR';
const options1 = sqlAutocomplete.autocomplete(sql1);
console.dir(options1);

// [ AutocompleteOption { value: 'FROM', optionType: 'KEYWORD' } ]

const sql2 = 'SELECT * FROM myDatab';
const options2 = sqlAutocomplete.autocomplete(sql2);
console.dir(options2);

// [ AutocompleteOption { value: 'myDatabaseTableName', optionType: 'TABLE' } ]
```

## Created By

[![modelDBA logo](https://modeldba.com/sql-autocomplete/modelDBA128x128.png "modelDBA")](https://modeldba.com)

sql-autocomplete is a project created and maintained by [modelDBA](https://modeldba.com), a database IDE for modern developers. 
modelDBA lets you visualize SQL as you type and edit tables easily with a no-code table editor.
