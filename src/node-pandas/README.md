# node-pandas

An [npm package](https://www.npmjs.com/package/node-pandas) that incorporates minimal features of python [pandas](https://pandas.pydata.org/). Check it on npm at [https://www.npmjs.com/package/node-pandas](https://www.npmjs.com/package/node-pandas).

![npm](https://img.shields.io/npm/v/node-pandas.svg?label=node-pandas) ![NPM](https://img.shields.io/npm/l/node-pandas.svg)

> You can also have a look at this colorful documentation at [https://hygull.github.io/node-pandas/](https://hygull.github.io/node-pandas/).
>
> **Note:** Currently, this package is in development. More methods/functions/attributes will be added with time. 
>
> For now, you can 
>
> + create Series(using 1D array), DataFrame(using 2D array or file `readCsv()`)
> + access Series object using exactly an array like syntax (indexing, looping etc.)
> + view columns, index
> + save DataFrame in a CSV file `toCsv()`
> + access elements using indices/column names
> + view contents in pretty tabular form on console
> + access DataFrame's columns using column names

## Installation

| Installation type | command |
| --- | --- |
| Local | `npm install node-pandas --save` |
| Local as dev dependency | `npm install node-pandas --save-dev` |
| Global | `npm install node-pandas` |


## Table of contents

> ### `Series`

1.  [Example 1 - Creating Series using 1D array/list](#s-ex1)

> ### `DataFrame`

1.  [Example 1 - Creating DataFrame using 2D array/list](#df-ex1)

2.  [Example 2 - Creating DataFrame using a CSV file](#df-ex2)

3.  [Example 3 - Saving DataFrame in a CSV file](#df-ex3)

4.  [Example 4 - Accessing columns (Retrieving columns using column name)](#df-ex4) - `df.fullName -> ["R A", "B R", "P K"]`

<hr>

## Getting started

> ## `Series`

<h3 id='s-ex1'><code>Example 1 - Creating Series using 1D array/list</code></h3>

```javascript
> const pd = require("node-pandas")
undefined
> 
> s = pd.Series([1, 9, 2, 6, 7, -8, 4, -3, 0, 5]) 
NodeSeries [
  1,
  9,
  2,
  6,
  7,
  -8,
  4,
  -3,
  0,
  5,
]
> 
> s.show
┌─────────┬────────┐
│ (index) │ Values │
├─────────┼────────┤
│    0    │   1    │
│    1    │   9    │
│    2    │   2    │
│    3    │   6    │
│    4    │   7    │
│    5    │   -8   │
│    6    │   4    │
│    7    │   -3   │
│    8    │   0    │
│    9    │   5    │
└─────────┴────────┘
undefined
> 
> s[0]  // First element in Series
1
> s.length // Total number of elements 
10
> 
```

<hr>

> ## `DataFrame` 

<h3 id='df-ex1'><code>Example 1 - Creating DataFrame using 2D array/list</code></h3>

```javascript
> const pd = require("node-pandas")
undefined
> 
> columns = ['full_name', 'user_id', 'technology']
[ 'full_name', 'user_id', 'technology' ]
> 
> df = pd.DataFrame([
...     ['Guido Van Rossum', 6, 'Python'],
...     ['Ryan Dahl', 5, 'Node.js'],
...     ['Anders Hezlsberg', 7, 'TypeScript'],
...     ['Wes McKinney', 3, 'Pandas'],
...     ['Ken Thompson', 1, 'B language']
... ], columns)
NodeDataFrame [
  [ 'Guido Van Rossum', 6, 'Python' ],
  [ 'Ryan Dahl', 5, 'Node.js' ],
  [ 'Anders Hezlsberg', 7, 'TypeScript' ],
  [ 'Wes McKinney', 3, 'Pandas' ],
  [ 'Ken Thompson', 1, 'B language' ],
  columns: [ 'full_name', 'user_id', 'technology' ],
  index: [ 0, 1, 2, 3, 4 ],
  rows: 5,
  cols: 3,
  out: true
]
> 
> df.show
┌─────────┬────────────────────┬─────────┬──────────────┐
│ (index) │     full_name      │ user_id │  technology  │
├─────────┼────────────────────┼─────────┼──────────────┤
│    0    │ 'Guido Van Rossum' │    6    │   'Python'   │
│    1    │    'Ryan Dahl'     │    5    │  'Node.js'   │
│    2    │ 'Anders Hezlsberg' │    7    │ 'TypeScript' │
│    3    │   'Wes McKinney'   │    3    │   'Pandas'   │
│    4    │   'Ken Thompson'   │    1    │ 'B language' │
└─────────┴────────────────────┴─────────┴──────────────┘
undefined
> 
> df.index
[ 0, 1, 2, 3, 4 ]
> 
> df.columns
[ 'full_name', 'user_id', 'technology' ]
> 
```

<h3 id='df-ex2'><code>Example 2 - Creating DataFrame using a CSV file</code></h3>

> **Note**: If CSV will have multiple newlines b/w 2 consecutive rows, no problem, it takes care of it and considers as single newline.
>
> **`df = pd.readCsv(csvPath)`** where `CsvPath` is absolute/relative path of the CSV file.
>
> **Examples:**
>
> `df = pd.readCsv("../node-pandas/docs/csvs/devs.csv")`
>
> `df = pd.readCsv("/Users/hygull/Projects/NodeJS/node-pandas/docs/csvs/devs.csv")`

[devs.csv](https://github.com/hygull/node-pandas/blob/master/docs/csvs/devs.csv) &raquo; `cat /Users/hygull/Projects/NodeJS/node-pandas/docs/csvs/devs.csv`

```csv
fullName,Profession,Language,DevId
Ken Thompson,C developer,C,1122
Ron Wilson,Ruby developer,Ruby,4433
Jeff Thomas,Java developer,Java,8899


Rishikesh Agrawani,Python developer,Python,6677
Kylie Dwine,C++,C++ Developer,0011

Briella Brown,JavaScript developer,JavaScript,8844
```

Now have a look the below statements executed on Node REPL.

```javascript
> const pd = require("node-pandas")
undefined
> 
> df = pd.readCsv("/Users/hygull/Projects/NodeJS/node-pandas/docs/csvs/devs.csv")
NodeDataFrame [
  {
    fullName: 'Ken Thompson',
    Profession: 'C developer',
    Language: 'C',
    DevId: 1122
  },
  {
    fullName: 'Ron Wilson',
    Profession: 'Ruby developer',
    Language: 'Ruby',
    DevId: 4433
  },
  {
    fullName: 'Jeff Thomas',
    Profession: 'Java developer',
    Language: 'Java',
    DevId: 8899
  },
  {
    fullName: 'Rishikesh Agrawani',
    Profession: 'Python developer',
    Language: 'Python',
    DevId: 6677
  },
  {
    fullName: 'Kylie Dwine',
    Profession: 'C++',
    Language: 'C++ Developer',
    DevId: 11
  },
  {
    fullName: 'Briella Brown',
    Profession: 'JavaScirpt developer',
    Language: 'JavaScript',
    DevId: 8844
  },
  columns: [ 'fullName', 'Profession', 'Language', 'DevId' ],
  index: [ 0, 1, 2, 3, 4, 5 ],
  rows: 6,
  cols: 4,
  out: true
]
> 
> df.index
[ 0, 1, 2, 3, 4, 5 ]
> 
> df.columns
[ 'fullName', 'Profession', 'Language', 'DevId' ]
> 
> df.show
┌─────────┬──────────────────────┬────────────────────────┬─────────────────┬───────┐
│ (index) │       fullName       │       Profession       │    Language     │ DevId │
├─────────┼──────────────────────┼────────────────────────┼─────────────────┼───────┤
│    0    │    'Ken Thompson'    │     'C developer'      │       'C'       │ 1122  │
│    1    │     'Ron Wilson'     │    'Ruby developer'    │     'Ruby'      │ 4433  │
│    2    │    'Jeff Thomas'     │    'Java developer'    │     'Java'      │ 8899  │
│    3    │ 'Rishikesh Agrawani' │   'Python developer'   │    'Python'     │ 6677  │
│    4    │    'Kylie Dwine'     │         'C++'          │ 'C++ Developer' │  11   │
│    5    │   'Briella Brown'    │ 'JavaScript developer' │  'JavaScript'   │ 8844  │
└─────────┴──────────────────────┴────────────────────────┴─────────────────┴───────┘
undefined
> 
```

```javascript
> df[0]['fullName']
'Ken Thompson'
> 
> df[3]['Profession']
'Python developer'
> 
> df[5]['Language']
'JavaScript'
> 
```

<h3 id='df-ex3'><code>Example 3 - Saving DataFrame in a CSV file</code></h3>

> **Note:** Here we will save DataFrame in `/Users/hygull/Desktop/newDevs.csv` (in this case) which can be different in your case.

```javascript
> const pd = require("node-pandas")
undefined
> 
> df = pd.readCsv("./docs/csvs/devs.csv")
NodeDataFrame [
  {
    fullName: 'Ken Thompson',
    Profession: 'C developer',
    Language: 'C',
    DevId: 1122
  },
  {
    fullName: 'Ron Wilson',
    Profession: 'Ruby developer',
    Language: 'Ruby',
    DevId: 4433
  },
  {
    fullName: 'Jeff Thomas',
    Profession: 'Java developer',
    Language: 'Java',
    DevId: 8899
  },
  {
    fullName: 'Rishikesh Agrawani',
    Profession: 'Python developer',
    Language: 'Python',
    DevId: 6677
  },
  {
    fullName: 'Kylie Dwine',
    Profession: 'C++',
    Language: 'C++ Developer',
    DevId: 11
  },
  {
    fullName: 'Briella Brown',
    Profession: 'JavaScirpt developer',
    Language: 'JavaScript',
    DevId: 8844
  },
  columns: [ 'fullName', 'Profession', 'Language', 'DevId' ],
  index: [ 0, 1, 2, 3, 4, 5 ],
  rows: 6,
  cols: 4,
  out: true
]
> 
> df.cols
4
> df.rows
6
> df.columns
[ 'fullName', 'Profession', 'Language', 'DevId' ]
> df.index
[ 0, 1, 2, 3, 4, 5 ]
> 
> df.toCsv("/Users/hygull/Desktop/newDevs.csv")
undefined
> CSV file is successfully created at /Users/hygull/Desktop/newDevs.csv

> 
```

Let's see content of `/Users/hygull/Desktop/newDevs.csv`

> **cat /Users/hygull/Desktop/newDevs.csv**

```csv 
fullName,Profession,Language,DevId
Ken Thompson,C developer,C,1122
Ron Wilson,Ruby developer,Ruby,4433
Jeff Thomas,Java developer,Java,8899
Rishikesh Agrawani,Python developer,Python,6677
Kylie Dwine,C++,C++ Developer,11
Briella Brown,JavaScript developer,JavaScript,8844
```

<hr>

<h3 id='df-ex4'><code>Example 4 - Accessing columns (Retrieving columns using column name)</code></h3>

> **CSV file** (devs.csv): [./docs/csvs/devs.csv](./docs/csvs/devs.csv)

```javascript
const pd = require("node-pandas")
df = pd.readCsv("./docs/csvs/devs.csv") // Node DataFrame object

df.show // View DataFrame in tabular form
/*
┌─────────┬──────────────────────┬────────────────────────┬─────────────────┬───────┐
│ (index) │       fullName       │       Profession       │    Language     │ DevId │
├─────────┼──────────────────────┼────────────────────────┼─────────────────┼───────┤
│    0    │    'Ken Thompson'    │     'C developer'      │       'C'       │ 1122  │
│    1    │     'Ron Wilson'     │    'Ruby developer'    │     'Ruby'      │ 4433  │
│    2    │    'Jeff Thomas'     │    'Java developer'    │     'Java'      │ 8899  │
│    3    │ 'Rishikesh Agrawani' │   'Python developer'   │    'Python'     │ 6677  │
│    4    │    'Kylie Dwine'     │         'C++'          │ 'C++ Developer' │  11   │
│    5    │   'Briella Brown'    │ 'JavaScirpt developer' │  'JavaScript'   │ 8844  │
└─────────┴──────────────────────┴────────────────────────┴─────────────────┴───────┘
*/

console.log(df['fullName'])
/*
    NodeSeries [
      'Ken Thompson',
      'Ron Wilson',
      'Jeff Thomas',
      'Rishikesh Agrawani',
      'Kylie Dwine',
      'Briella Brown'
    ]
*/

console.log(df.DevId)
/* 
    NodeSeries [ 1122, 4433, 8899, 6677, 11, 8844 ]
*/

let languages = df.Language
console.log(languages) 
/*
    NodeSeries [
      'C',
      'Ruby',
      'Java',
      'Python',
      'C++ Developer',
      'JavaScript'
    ]
*/

console.log(languages[0], '&', languages[1]) // C & Ruby


let professions = df.Profession
console.log(professions) 
/*
    NodeSeries [
      'C developer',
      'Ruby developer',
      'Java developer',
      'Python developer',
      'C++',
      'JavaScirpt developer'
    ]
*/

// Iterate like arrays
for(let profession of professions) {
    console.log(profession)
}
/*
    C developer
    Ruby developer
    Java developer
    Python developer
    C++
    JavaScirpt developer
*/
```

<hr>

### References

+ [Node's util](https://millermedeiros.github.io/mdoc/examples/node_api/doc/util.html)

+ [JavaScript Arrays - w3schools](https://www.w3schools.com/js/js_arrays.asp)

+ [How to test your new NPM module without publishing it every 5 minutes](https://medium.com/@the1mills/how-to-test-your-npm-module-without-publishing-it-every-5-minutes-1c4cb4b369be)

+ [Node's path](https://nodejs.org/dist/latest-v6.x/docs/api/path.html)

+ [Node's fs - file system](https://nodejs.org/dist/latest-v6.x/docs/api/fs.html)

+ [9 Ways to Remove Elements From A JavaScript Array - Plus How to Safely Clear JavaScript Arrays](https://love2dev.com/blog/javascript-remove-from-array/)

+ [JS - isNaN()](https://www.w3schools.com/jsref/jsref_isnan.asp)

+ [Check synchronously if file/directory exists in Node.js](https://stackoverflow.com/questions/4482686/check-synchronously-if-file-directory-exists-in-node-js/4482701)

+ [Node's require() returns an empty object (circular refs -> {})](https://stackoverflow.com/questions/23875233/require-returns-an-empty-object/23875299)

+ [Javascript - Mixins (Adding methods to classes)](https://javascript.info/mixins)

+ [JavaScript Object accessors(setters & getters)](https://www.w3schools.com/js/js_object_accessors.asp)

+ [JavaScript setter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get)

+ [JavaScript getter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set)

+ [JavaScript (enumerable, writable, configurable)](https://hashnode.com/post/what-are-enumerable-properties-in-javascript-ciljnbtqa000exx53n5nbkykx)

