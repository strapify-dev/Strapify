'use strict';

/**
 * card service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::card.card');
