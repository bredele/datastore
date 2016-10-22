# Datastore

  > [![Build Status](https://travis-ci.org/bredele/datastore.svg?branch=master)](https://travis-ci.org/bredele/datastore)
  [![NPM](https://img.shields.io/npm/v/datastore.svg)](https://www.npmjs.com/package/datastore)
  [![Downloads](https://img.shields.io/npm/dm/datastore.svg)](http://npm-stat.com/charts.html?package=datastore)

Datastore is a bloat free interface for data store and database access.

  * **Adaptive**: There are thousands of databases out there. Datastore intends to provide an agnostic but yet simple interface on top of them. Seamlessly swap between databases and never change your code.
  * **Async**: Never worry about when your data will be available. Datastore uses promises at its core and allows you to deal with asynchronous access elegantly.
  * **Isomorphic**: Datastore works server side and synchronizing data between your browser and your server has never been as easy.

[Try it online!]()

## Usage

```js
var store = require('datastore')

```

Check out [examples](/examples) and [docs](/doc) for more information.

## Installation

```shell
npm install datastore --save
```

[![NPM](https://nodei.co/npm/datastore.png)](https://nodei.co/npm/datastore/)


## Question

For questions and feedback please use our [twitter account](https://twitter.com/bredeleca). For support, bug reports and or feature requests please make sure to read our
<a href="https://github.com/bredele/contributing-guide" target="_blank">community guideline</a> and use the issue list of this repo and make sure it's not present yet in our reporting checklist.

## Contribution

Datastore is an open source project and would not exist without its community. If you want to participate please make sure to read our <a href="https://github.com/bredele/contributing-guide" target="_blank">guideline</a> before making a pull request. If you have any datastore-related project, component or other let everyone know in our wiki.

## License

The MIT License (MIT)

Copyright (c) 2016 Olivier Wietrich

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
