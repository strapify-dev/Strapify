import type { Schema, Attribute } from '@strapi/strapi';

export interface GeneralImageInfo extends Schema.Component {
  collectionName: 'components_general_image_infos';
  info: {
    displayName: 'Image Info';
  };
  attributes: {
    alt_text: Attribute.String;
    url: Attribute.String;
  };
}

export interface GeneralName extends Schema.Component {
  collectionName: 'components_general_names';
  info: {
    displayName: 'Name';
  };
  attributes: {
    first: Attribute.String;
    last: Attribute.String;
  };
}

export interface GeneralRepeatableTestComponent extends Schema.Component {
  collectionName: 'components_general_repeatable_test_components';
  info: {
    displayName: 'Repeatable Test Component';
  };
  attributes: {
    text: Attribute.String;
  };
}

export interface NestingTestsComponentOneLevelDeep extends Schema.Component {
  collectionName: 'components_nesting_tests_component_one_level_deeps';
  info: {
    displayName: 'Component One  Level Deep';
  };
  attributes: {
    text: Attribute.String;
  };
}

export interface NestingTestsComponentTwoLevelsDeep extends Schema.Component {
  collectionName: 'components_nesting_tests_component_two_levels_deeps';
  info: {
    displayName: 'Component Two Levels Deep';
  };
  attributes: {
    text: Attribute.String;
    one_level_deep: Attribute.Component<'nesting-tests.component-one-level-deep'>;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'general.image-info': GeneralImageInfo;
      'general.name': GeneralName;
      'general.repeatable-test-component': GeneralRepeatableTestComponent;
      'nesting-tests.component-one-level-deep': NestingTestsComponentOneLevelDeep;
      'nesting-tests.component-two-levels-deep': NestingTestsComponentTwoLevelsDeep;
    }
  }
}
