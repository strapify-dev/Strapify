'use strict';

/**
 * strapi-into-test controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::strapi-into-test.strapi-into-test');
