# apist

[![Greenkeeper badge](https://badges.greenkeeper.io/exeto/apist.svg)](https://greenkeeper.io/)
[![Build Status][buildstat-image]][buildstat-url] [![Coverage Status][coverage-image]][coverage-url] [![Dependency Status][depstat-image]][depstat-url]

> Simple REST API client

## Install

```bash
$ npm install --save apist
```

## Usage

```js
import Apist from 'apist';

const users = new Apist('users');

users.fetch(10, { query: 'query' })
  .then(data => console.log(data.firstName));
//=> GET /users/10?query=query
```

Within the used [`fetch`](https://fetch.spec.whatwg.org/). You can add polyfill to your project.

Configure to work with your API, by overriding methods.

```js
class CustomApist extends Apist {
  constructor(resource) {
    super(resource);

    // Used only when sending data.
    // By default `application/json`.
    this.contentType = 'application/json';

    // Fetch options.
    this.options = {};

    this.headers = {};
    this.host = 'http://example.com';
    this.namespace = 'api/v2';
  }

  handleError(err) {}

  // Serialization of sent data.
  serialize(data) {}

  // Deserializing the received data.
  deserialize(req, res) {}
}
```

## API

### Apist(resource)

#### resource

Type: `string`

The name of the API resource.

### Instance

All CRUD methods return a `Promise`.

#### .fetchAll([query])

> GET `/resource?query`

##### query

Type: `object`

#### .fetch(id, [query])

> GET `/resource/:id?query`

##### id

Type: `number|string`

##### query

Type: `object`

#### .create(data)

> POST `/resource`

##### data

Type: `any`

#### .update(id, data)

> PUT `/resource/:id`

##### id

Type: `number|string`

##### data

Type: `any`

#### .delete(id)

> DELETE `/resource/:id`

##### id

Type: `any`

## Related

- [redux-apist](https://github.com/exeto/redux-apist) - Creator API actions for redux-thunk

## License

[MIT](LICENSE.md) © [Timofey Dergachev](https://exeto.me/)

[buildstat-url]: https://travis-ci.org/exeto/apist?branch=master
[buildstat-image]: https://img.shields.io/travis/exeto/apist/master.svg?style=flat-square
[coverage-url]: https://coveralls.io/github/exeto/apist?branch=master
[coverage-image]: https://img.shields.io/coveralls/exeto/apist/master.svg?style=flat-square
[depstat-url]: https://david-dm.org/exeto/apist#info=Dependencies
[depstat-image]: https://img.shields.io/david/exeto/apist.svg?style=flat-square
