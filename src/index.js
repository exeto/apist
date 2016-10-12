/* eslint class-methods-use-this: off */

import avali from 'avali';
import queryStringify from 'qs/lib/stringify';

import join from './utils/urlJoin';

export default class Apist {
  constructor(resource) {
    avali(['str'], arguments);

    this.cache = {};
    this.resource = resource;
    this.host = null;
    this.namespace = null;
    this.contentType = 'application/json';
    this.options = {};
    this.headers = {};
  }

  callApi(method, { id, query, data } = {}) {
    const url = this.buildUrl(id, query);
    const { cache } = this;

    if (method === 'GET' && cache[url]) {
      return cache[url];
    }

    const options = Object.assign({}, this.options);
    options.method = method;
    options.headers = this.headers;

    if (data) {
      options.headers['Content-Type'] = this.contentType;
      options.body = this.serialize(data);
    }

    const request = fetch(url, options)
      .then(res => this.deserialize(options, res))
      .then(result => (delete cache[url] && result))
      .catch((err) => {
        delete cache[url];
        throw err;
      })
      .catch(this.handleError);

    if (method === 'GET') {
      this.cache[url] = request;
    }

    return request;
  }

  buildUrl(id, query) {
    query = query && `?${queryStringify(query)}`;
    return join(this.host, this.namespace, this.resource, id, query);
  }

  serialize(data) {
    return JSON.stringify(data);
  }

  deserialize(req, res) {
    if (res.ok) return req.method === 'DELETE' || res.json();

    throw new Error(`${res.status} ${res.statusText}`);
  }

  handleError(err) {
    throw err;
  }

  fetchAll(query) {
    avali(['obj, nil'], arguments);
    return this.callApi('GET', { query });
  }

  fetch(id, query) {
    avali(['num, str', 'obj, nil'], arguments);
    return this.callApi('GET', { id, query });
  }

  create(data) {
    return this.callApi('POST', { data });
  }

  update(id, data) {
    avali(['num, str'], arguments);
    return this.callApi('PUT', { id, data });
  }

  delete(id) {
    avali(['num, str'], arguments);
    return this.callApi('DELETE', { id });
  }
}
