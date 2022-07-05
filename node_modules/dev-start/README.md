# dev-start

Use cluster auto fork code at file save;

## Install

```sh
yarn add dev-start -D
```

## Use

create dev.js:

```js
const autoReload = require('../lib');


autoReload(()=>{
  require('./index.js');
}, ()=>{
  console.log('onReload');
})
```

## Dev Start:

```sh
node dev.js
```