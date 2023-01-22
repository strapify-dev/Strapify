'use strict';

/**
 * strapi-into-test service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::strapi-into-test.strapi-into-test');
