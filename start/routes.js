'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return { mensagem: 'ok' };
});

Route.post('/auth/register', 'AuthController.register');
Route.post('/auth/login', 'AuthController.login');

Route.get('/users', 'UserController.index');
Route.put('/users/:id', 'UserController.update');

Route.get('files/:name', 'FileController.show');

Route.resource('/offices','OfficeController');
Route.resource('/profiles','ProfileController');
Route.resource('/connections','ConnectionSearchController');
Route.resource('/searchareas','SearchAreaController');
