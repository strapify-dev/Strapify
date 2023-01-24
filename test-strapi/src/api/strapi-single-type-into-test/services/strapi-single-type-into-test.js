'use strict';

/**
 * strapi-single-type-into-test service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::strapi-single-type-into-test.strapi-single-type-into-test');
