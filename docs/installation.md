## NPM

Datastore has been built with modularity in mind and for this reason, it is recommended to use NPM has the primary installation method. Datastore's code follows CommonJS standards and pairs nicely with module bundler such as Browserify or Webpack

```shell
# latest stable
$ npm install datastore
```

## Standalone

If you don't use modules bundler, you can include datastore as a global variable by downloading the standalone version and include it with a script tag:


<a style="color:#EE6650;border:1px solid #EE6650;padding: 1em 1.5em;display:block;" href="https://github.com/bredele/datastore/blob/master/dist/datastore.js" target="_blank">Development version</a><br>
<a style="color:#EE6650;border:1px solid #EE6650;padding: 1em 1.5em;display:block;" href="https://github.com/bredele/datastore/blob/master/dist/datastore.min.js" target="_blank">Production version</a>


## Dev Build

```shell
git clone https://github.com/bredele/datastore.git
cd datastore
npm install
npm run build
```
