<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');
$routes->post('/generate', 'ActivityGenerator::generate');
$routes->post('/validate', 'ActivityValidator::validateactivity');
