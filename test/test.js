import test from 'ava';
import nock from 'nock';
import fetch from 'node-fetch';
import Apist from '../src';

global.fetch = fetch;

nock('http://example.com')
  .get('/users')
  .query({ test: 'test' })
  .reply(200, [{ name: 'John' }])
  .get('/users/20')
  .query({ test: 'test' })
  .reply(200, { name: 'John' })
  .post('/users', { name: 'John' })
  .reply(201, { name: 'John' })
  .put('/users/20', { name: 'John' })
  .reply(200, { name: 'John' })
  .delete('/users/20')
  .reply(204)
  .get('/users/combine')
  .times(1)
  .reply(200, {})
  .get('/users/404')
  .reply(404);

test('build url', t => {
  const user = new Apist('users');

  t.is(user.buildUrl(), '/users');
  t.is(user.buildUrl(20), '/users/20');
  t.is(user.buildUrl(20, { name: 'John' }), '/users/20?name=John');
  t.is(user.buildUrl(null, { name: 'John' }), '/users?name=John');
  user.namespace = 'api';
  t.is(user.buildUrl(20), '/api/users/20');
  user.host = 'http://example.com';
  t.is(user.buildUrl(20), 'http://example.com/api/users/20');
});

test('CRUD methods', t => {
  const user = new Apist('users');
  user.host = 'http://example.com';

  return Promise.all([
    user.fetchAll({ test: 'test' }).then(r => t.is(r[0].name, 'John')),
    user.fetch(20, { test: 'test' }).then(r => t.is(r.name, 'John')),
    user.create({ name: 'John' }).then(r => t.is(r.name, 'John')),
    user.update(20, { name: 'John' }).then(r => t.is(r.name, 'John')),
    user.delete(20).then(() => t.pass()),
    user.fetch(404).catch(err => t.is(err.message, '404 Not Found')),
  ]);
});

test('combine requests', t => {
  const user = new Apist('users');
  user.host = 'http://example.com';

  return Promise.all([
    user.fetch('combine'),
    user.fetch('combine').then(() => t.pass()),
  ]);
});
