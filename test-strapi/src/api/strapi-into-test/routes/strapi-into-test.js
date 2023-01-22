'use strict';

/**
 * strapi-into-test router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::strapi-into-test.strapi-into-test');
