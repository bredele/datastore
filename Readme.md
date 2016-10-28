# Datastore

  > [Brick](http://github.com/bredele/brickjs) reactive data layer

[![Build Status](https://travis-ci.org/bredele/datastore.svg?branch=master)](https://travis-ci.org/bredele/datastore)
[![NPM](https://img.shields.io/npm/v/datastore.svg)](https://www.npmjs.com/package/datastore)
[![Downloads](https://img.shields.io/npm/dm/datastore.svg)](http://npm-stat.com/charts.html?package=datastore)
[![pledge](https://bredele.github.io/contributing-guide/community-pledge.svg)](https://github.com/bredele/contributing-guide/blob/master/community.md)

Datastore is a bloat free interface for data store and database access.

  * **Adaptive**: There are hundreds of databases out there. Datastore intends to provide an agnostic but yet simple interface on top of them. Seamlessly swap between database adapters and never change your code.
  * **Async**: Never worry about when your data will be available. Datastore uses promises at its core and allows you to deal with asynchronous access elegantly.
  * **Isomorphic**: Datastore works server side and synchronizing data between your browser and your server has never been as easy.

[Try it online!](http://requirebin.com/?gist=457b620d0e3fd55db5352c5446aa01df)

## Usage

```js
var store = require('datastore')

// initialize datastore with mongodb adapter
var data = store({
  hello: 'world'
}, mongo('user'))

data.set('age', 30)
data.set('name', 'bredele').then(function() {
  // do something when name has been set in database
})
```

Datastore's goal is to help you focus on a single [API](/test) without committing to one type of data storage. Thus you can easily switch in the middle of your projects from a in-memory store to any kind of database without changing a single line of code.

Check out [examples](/examples) and [docs](/docs) for more information.

## Installation

```shell
npm install datastore --save
```

[![NPM](https://nodei.co/npm/datastore.png)](https://nodei.co/npm/datastore/)


## Question

For questions and feedback please use our [twitter account](https://twitter.com/bredeleca). For support, bug reports and or feature requests please make sure to read our
<a href="https://github.com/bredele/contributing-guide" target="_blank">community guideline</a> and use the issue list of this repo and make sure it's not present yet in our reporting checklist.

## Contribution

Datastore is an open source project and would not exist without its community. If you want to participate please make sure to read our <a href="https://github.com/bredele/contributing-guide" target="_blank">guideline</a> before making a pull request. If you have any datastore-related project, adapter or other let everyone know in our wiki.

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
