import type { Schema, Attribute } from '@strapi/strapi';

export interface AdminPermission extends Schema.CollectionType {
  collectionName: 'admin_permissions';
  info: {
    name: 'Permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    actionParameters: Attribute.JSON & Attribute.DefaultTo<{}>;
    subject: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    properties: Attribute.JSON & Attribute.DefaultTo<{}>;
    conditions: Attribute.JSON & Attribute.DefaultTo<[]>;
    role: Attribute.Relation<'admin::permission', 'manyToOne', 'admin::role'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminUser extends Schema.CollectionType {
  collectionName: 'admin_users';
  info: {
    name: 'User';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    firstname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    username: Attribute.String;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.Private &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: Attribute.String & Attribute.Private;
    registrationToken: Attribute.String & Attribute.Private;
    isActive: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
    roles: Attribute.Relation<'admin::user', 'manyToMany', 'admin::role'> &
      Attribute.Private;
    blocked: Attribute.Boolean & Attribute.Private & Attribute.DefaultTo<false>;
    preferedLanguage: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface AdminRole extends Schema.CollectionType {
  collectionName: 'admin_roles';
  info: {
    name: 'Role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    code: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String;
    users: Attribute.Relation<'admin::role', 'manyToMany', 'admin::user'>;
    permissions: Attribute.Relation<
      'admin::role',
      'oneToMany',
      'admin::permission'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface AdminApiToken extends Schema.CollectionType {
  collectionName: 'strapi_api_tokens';
  info: {
    name: 'Api Token';
    singularName: 'api-token';
    pluralName: 'api-tokens';
    displayName: 'Api Token';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    type: Attribute.Enumeration<['read-only', 'full-access', 'custom']> &
      Attribute.Required &
      Attribute.DefaultTo<'read-only'>;
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: Attribute.DateTime;
    permissions: Attribute.Relation<
      'admin::api-token',
      'oneToMany',
      'admin::api-token-permission'
    >;
    expiresAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminApiTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_api_token_permissions';
  info: {
    name: 'API Token Permission';
    description: '';
    singularName: 'api-token-permission';
    pluralName: 'api-token-permissions';
    displayName: 'API Token Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    token: Attribute.Relation<
      'admin::api-token-permission',
      'manyToOne',
      'admin::api-token'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminTransferToken extends Schema.CollectionType {
  collectionName: 'strapi_transfer_tokens';
  info: {
    name: 'Transfer Token';
    singularName: 'transfer-token';
    pluralName: 'transfer-tokens';
    displayName: 'Transfer Token';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: Attribute.DateTime;
    permissions: Attribute.Relation<
      'admin::transfer-token',
      'oneToMany',
      'admin::transfer-token-permission'
    >;
    expiresAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminTransferTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_transfer_token_permissions';
  info: {
    name: 'Transfer Token Permission';
    description: '';
    singularName: 'transfer-token-permission';
    pluralName: 'transfer-token-permissions';
    displayName: 'Transfer Token Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    token: Attribute.Relation<
      'admin::transfer-token-permission',
      'manyToOne',
      'admin::transfer-token'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUploadFile extends Schema.CollectionType {
  collectionName: 'files';
  info: {
    singularName: 'file';
    pluralName: 'files';
    displayName: 'File';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    alternativeText: Attribute.String;
    caption: Attribute.String;
    width: Attribute.Integer;
    height: Attribute.Integer;
    formats: Attribute.JSON;
    hash: Attribute.String & Attribute.Required;
    ext: Attribute.String;
    mime: Attribute.String & Attribute.Required;
    size: Attribute.Decimal & Attribute.Required;
    url: Attribute.String & Attribute.Required;
    previewUrl: Attribute.String;
    provider: Attribute.String & Attribute.Required;
    provider_metadata: Attribute.JSON;
    related: Attribute.Relation<'plugin::upload.file', 'morphToMany'>;
    folder: Attribute.Relation<
      'plugin::upload.file',
      'manyToOne',
      'plugin::upload.folder'
    > &
      Attribute.Private;
    folderPath: Attribute.String &
      Attribute.Required &
      Attribute.Private &
      Attribute.SetMinMax<{
        min: 1;
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUploadFolder extends Schema.CollectionType {
  collectionName: 'upload_folders';
  info: {
    singularName: 'folder';
    pluralName: 'folders';
    displayName: 'Folder';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<{
        min: 1;
      }>;
    pathId: Attribute.Integer & Attribute.Required & Attribute.Unique;
    parent: Attribute.Relation<
      'plugin::upload.folder',
      'manyToOne',
      'plugin::upload.folder'
    >;
    children: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.folder'
    >;
    files: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.file'
    >;
    path: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<{
        min: 1;
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginEzformsSubmission extends Schema.CollectionType {
  collectionName: 'ezforms_submission';
  info: {
    tableName: 'submission';
    singularName: 'submission';
    pluralName: 'submissions';
    displayName: 'Form Submissions';
    description: 'A Place for all your form submissions';
    kind: 'collectionType';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: true;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    score: Attribute.String &
      Attribute.SetMinMax<{
        min: 1;
        max: 50;
      }>;
    formName: Attribute.String &
      Attribute.SetMinMax<{
        min: 1;
        max: 50;
      }>;
    data: Attribute.JSON;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::ezforms.submission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::ezforms.submission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginEzformsRecipient extends Schema.CollectionType {
  collectionName: 'ezforms_recipient';
  info: {
    tableName: 'recipients';
    singularName: 'recipient';
    pluralName: 'recipients';
    displayName: 'Notification Recipients';
    description: 'List of Notification Recipients';
    kind: 'collectionType';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: true;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.SetMinMax<{
        min: 1;
        max: 50;
      }>;
    email: Attribute.String &
      Attribute.SetMinMax<{
        min: 1;
        max: 50;
      }>;
    number: Attribute.String &
      Attribute.SetMinMax<{
        min: 1;
        max: 50;
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::ezforms.recipient',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::ezforms.recipient',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginI18NLocale extends Schema.CollectionType {
  collectionName: 'i18n_locale';
  info: {
    singularName: 'locale';
    pluralName: 'locales';
    collectionName: 'locales';
    displayName: 'Locale';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.SetMinMax<{
        min: 1;
        max: 50;
      }>;
    code: Attribute.String & Attribute.Unique;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsPermission
  extends Schema.CollectionType {
  collectionName: 'up_permissions';
  info: {
    name: 'permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String & Attribute.Required;
    role: Attribute.Relation<
      'plugin::users-permissions.permission',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsRole extends Schema.CollectionType {
  collectionName: 'up_roles';
  info: {
    name: 'role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    description: Attribute.String;
    type: Attribute.String & Attribute.Unique;
    permissions: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.permission'
    >;
    users: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.user'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsUser extends Schema.CollectionType {
  collectionName: 'up_users';
  info: {
    name: 'user';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  options: {
    draftAndPublish: false;
    timestamps: true;
  };
  attributes: {
    username: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    provider: Attribute.String;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: Attribute.String & Attribute.Private;
    confirmationToken: Attribute.String & Attribute.Private;
    confirmed: Attribute.Boolean & Attribute.DefaultTo<false>;
    blocked: Attribute.Boolean & Attribute.DefaultTo<false>;
    role: Attribute.Relation<
      'plugin::users-permissions.user',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiCollection1Collection1 extends Schema.CollectionType {
  collectionName: 'collection1_entries';
  info: {
    singularName: 'collection1';
    pluralName: 'collection1-entries';
    displayName: 'Collection1';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    text: Attribute.String & Attribute.Required & Attribute.Unique;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::collection1.collection1',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::collection1.collection1',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiStrapiClassTestStrapiClassTest
  extends Schema.CollectionType {
  collectionName: 'strapi_class_tests';
  info: {
    singularName: 'strapi-class-test';
    pluralName: 'strapi-class-tests';
    displayName: 'Strapi Class Test';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    background: Attribute.String;
    font: Attribute.String;
    should_be_blue: Attribute.Boolean;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::strapi-class-test.strapi-class-test',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::strapi-class-test.strapi-class-test',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiStrapiComponentsTestStrapiComponentsTest
  extends Schema.CollectionType {
  collectionName: 'strapi_components_tests';
  info: {
    singularName: 'strapi-components-test';
    pluralName: 'strapi-components-tests';
    displayName: 'Strapi Components Test';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    one_level_deep: Attribute.Component<'nesting-tests.component-one-level-deep'>;
    two_levels_deep: Attribute.Component<'nesting-tests.component-two-levels-deep'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::strapi-components-test.strapi-components-test',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::strapi-components-test.strapi-components-test',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiStrapiCssRuleTestStrapiCssRuleTest
  extends Schema.CollectionType {
  collectionName: 'strapi_css_rule_tests';
  info: {
    singularName: 'strapi-css-rule-test';
    pluralName: 'strapi-css-rule-tests';
    displayName: 'Strapi CSS Rule Test';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    img_url: Attribute.String;
    color: Attribute.Enumeration<['red', 'green', 'blue']>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::strapi-css-rule-test.strapi-css-rule-test',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::strapi-css-rule-test.strapi-css-rule-test',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiStrapiFieldTestStrapiFieldTest
  extends Schema.CollectionType {
  collectionName: 'strapi_field_tests';
  info: {
    singularName: 'strapi-field-test';
    pluralName: 'strapi-field-tests';
    displayName: 'Strapi Field Test';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    text: Attribute.String;
    email: Attribute.Email;
    rich_text: Attribute.RichText;
    number_integer: Attribute.Integer;
    number_big_integer: Attribute.BigInteger;
    number_decimal: Attribute.Decimal;
    number_float: Attribute.Float;
    enum: Attribute.Enumeration<
      ['enum value 0', 'enum value 1', 'enum value 2']
    >;
    date: Attribute.Date;
    datetime: Attribute.DateTime;
    time: Attribute.Time;
    image: Attribute.Media;
    video: Attribute.Media;
    boolean: Attribute.Boolean;
    video_url: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::strapi-field-test.strapi-field-test',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::strapi-field-test.strapi-field-test',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiStrapiFilterSortPageTestStrapiFilterSortPageTest
  extends Schema.CollectionType {
  collectionName: 'strapi_filter_sort_page_tests';
  info: {
    singularName: 'strapi-filter-sort-page-test';
    pluralName: 'strapi-filter-sort-page-tests';
    displayName: 'Strapi Filter Sort Page Test';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    full_name: Attribute.String;
    name: Attribute.Component<'general.name'>;
    boolean: Attribute.Boolean;
    number: Attribute.Float;
    enum: Attribute.Enumeration<['enum0', 'enum1', 'enum2', 'enum3']>;
    date: Attribute.Date;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::strapi-filter-sort-page-test.strapi-filter-sort-page-test',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::strapi-filter-sort-page-test.strapi-filter-sort-page-test',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiStrapiIntoTestStrapiIntoTest extends Schema.CollectionType {
  collectionName: 'strapi_into_tests';
  info: {
    singularName: 'strapi-into-test';
    pluralName: 'strapi-into-tests';
    displayName: 'Strapi Into Test';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    image_info: Attribute.Component<'general.image-info'>;
    name: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::strapi-into-test.strapi-into-test',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::strapi-into-test.strapi-into-test',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiStrapiRelationTestAStrapiRelationTestA
  extends Schema.CollectionType {
  collectionName: 'strapi_relation_test_as';
  info: {
    singularName: 'strapi-relation-test-a';
    pluralName: 'strapi-relation-test-as';
    displayName: 'Strapi Relation Test A';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    text: Attribute.String;
    one_a_many_b: Attribute.Relation<
      'api::strapi-relation-test-a.strapi-relation-test-a',
      'oneToMany',
      'api::strapi-relation-test-b.strapi-relation-test-b'
    >;
    many_b_many_a: Attribute.Relation<
      'api::strapi-relation-test-a.strapi-relation-test-a',
      'manyToMany',
      'api::strapi-relation-test-b.strapi-relation-test-b'
    >;
    one_b_one_a: Attribute.Relation<
      'api::strapi-relation-test-a.strapi-relation-test-a',
      'oneToOne',
      'api::strapi-relation-test-b.strapi-relation-test-b'
    >;
    one_way: Attribute.Relation<
      'api::strapi-relation-test-a.strapi-relation-test-a',
      'oneToMany',
      'api::strapi-relation-test-b.strapi-relation-test-b'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::strapi-relation-test-a.strapi-relation-test-a',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::strapi-relation-test-a.strapi-relation-test-a',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiStrapiRelationTestBStrapiRelationTestB
  extends Schema.CollectionType {
  collectionName: 'strapi_relation_test_bs';
  info: {
    singularName: 'strapi-relation-test-b';
    pluralName: 'strapi-relation-test-bs';
    displayName: 'Strapi Relation Test B';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    text: Attribute.String & Attribute.Required & Attribute.Unique;
    many_b_one_a: Attribute.Relation<
      'api::strapi-relation-test-b.strapi-relation-test-b',
      'manyToOne',
      'api::strapi-relation-test-a.strapi-relation-test-a'
    >;
    many_a_many_b: Attribute.Relation<
      'api::strapi-relation-test-b.strapi-relation-test-b',
      'manyToMany',
      'api::strapi-relation-test-a.strapi-relation-test-a'
    >;
    one_a_one_b: Attribute.Relation<
      'api::strapi-relation-test-b.strapi-relation-test-b',
      'oneToOne',
      'api::strapi-relation-test-a.strapi-relation-test-a'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::strapi-relation-test-b.strapi-relation-test-b',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::strapi-relation-test-b.strapi-relation-test-b',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiStrapiRepeatableTestStrapiRepeatableTest
  extends Schema.CollectionType {
  collectionName: 'strapi_repeatable_tests';
  info: {
    singularName: 'strapi-repeatable-test';
    pluralName: 'strapi-repeatable-tests';
    displayName: 'Strapi Repeatable Test';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    text: Attribute.String;
    images: Attribute.Media;
    videos: Attribute.Media;
    component: Attribute.Component<'general.repeatable-test-component', true>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::strapi-repeatable-test.strapi-repeatable-test',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::strapi-repeatable-test.strapi-repeatable-test',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiStrapiSingleTypeClassTestStrapiSingleTypeClassTest
  extends Schema.SingleType {
  collectionName: 'strapi_single_type_class_tests';
  info: {
    singularName: 'strapi-single-type-class-test';
    pluralName: 'strapi-single-type-class-tests';
    displayName: 'Strapi Single Type Class Test';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    font: Attribute.String;
    background: Attribute.String;
    should_be_blue: Attribute.Boolean;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::strapi-single-type-class-test.strapi-single-type-class-test',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::strapi-single-type-class-test.strapi-single-type-class-test',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiStrapiSingleTypeComponentsTestStrapiSingleTypeComponentsTest
  extends Schema.SingleType {
  collectionName: 'strapi_single_type_components_tests';
  info: {
    singularName: 'strapi-single-type-components-test';
    pluralName: 'strapi-single-type-components-tests';
    displayName: 'Strapi Single Type Components Test';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    one_level_deep: Attribute.Component<'nesting-tests.component-one-level-deep'>;
    two_levels_deep: Attribute.Component<'nesting-tests.component-two-levels-deep'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::strapi-single-type-components-test.strapi-single-type-components-test',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::strapi-single-type-components-test.strapi-single-type-components-test',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiStrapiSingleTypeCssRuleTestStrapiSingleTypeCssRuleTest
  extends Schema.SingleType {
  collectionName: 'strapi_single_type_css_rule_tests';
  info: {
    singularName: 'strapi-single-type-css-rule-test';
    pluralName: 'strapi-single-type-css-rule-tests';
    displayName: 'Strapi Single Type CSS Rule Test';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    img_url: Attribute.String;
    color: Attribute.Enumeration<['red', 'green', 'blue']>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::strapi-single-type-css-rule-test.strapi-single-type-css-rule-test',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::strapi-single-type-css-rule-test.strapi-single-type-css-rule-test',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiStrapiSingleTypeFieldTestStrapiSingleTypeFieldTest
  extends Schema.SingleType {
  collectionName: 'strapi_single_type_field_tests';
  info: {
    singularName: 'strapi-single-type-field-test';
    pluralName: 'strapi-single-type-field-tests';
    displayName: 'Strapi Single Type Field Test';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    text: Attribute.String;
    email: Attribute.Email;
    rich_text: Attribute.RichText;
    number_integer: Attribute.Integer;
    number_big_integer: Attribute.BigInteger;
    number_decimal: Attribute.Decimal;
    number_float: Attribute.Float;
    enum: Attribute.Enumeration<
      ['enum value 0', 'enum value 1', 'enum value 2']
    >;
    date: Attribute.Date;
    datetime: Attribute.DateTime;
    time: Attribute.Time;
    image: Attribute.Media;
    video: Attribute.Media;
    boolean: Attribute.Boolean;
    video_url: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::strapi-single-type-field-test.strapi-single-type-field-test',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::strapi-single-type-field-test.strapi-single-type-field-test',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiStrapiSingleTypeIntoTestStrapiSingleTypeIntoTest
  extends Schema.SingleType {
  collectionName: 'strapi_single_type_into_tests';
  info: {
    singularName: 'strapi-single-type-into-test';
    pluralName: 'strapi-single-type-into-tests';
    displayName: 'Strapi Single Type Into Test';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    image_info: Attribute.Component<'general.image-info'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::strapi-single-type-into-test.strapi-single-type-into-test',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::strapi-single-type-into-test.strapi-single-type-into-test',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiStrapiSingleTypeRelationTestStrapiSingleTypeRelationTest
  extends Schema.SingleType {
  collectionName: 'strapi_single_type_relation_tests';
  info: {
    singularName: 'strapi-single-type-relation-test';
    pluralName: 'strapi-single-type-relation-tests';
    displayName: 'Strapi Single Type Relation Test';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    one_to_one: Attribute.Relation<
      'api::strapi-single-type-relation-test.strapi-single-type-relation-test',
      'oneToOne',
      'api::strapi-relation-test-b.strapi-relation-test-b'
    >;
    one_to_many: Attribute.Relation<
      'api::strapi-single-type-relation-test.strapi-single-type-relation-test',
      'oneToMany',
      'api::strapi-relation-test-b.strapi-relation-test-b'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::strapi-single-type-relation-test.strapi-single-type-relation-test',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::strapi-single-type-relation-test.strapi-single-type-relation-test',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiStrapiSingleTypeRepeatableTestStrapiSingleTypeRepeatableTest
  extends Schema.SingleType {
  collectionName: 'strapi_single_type_repeatable_tests';
  info: {
    singularName: 'strapi-single-type-repeatable-test';
    pluralName: 'strapi-single-type-repeatable-tests';
    displayName: 'Strapi Single Type Repeatable Test';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    images: Attribute.Media;
    videos: Attribute.Media;
    components: Attribute.Component<'general.repeatable-test-component', true>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::strapi-single-type-repeatable-test.strapi-single-type-repeatable-test',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::strapi-single-type-repeatable-test.strapi-single-type-repeatable-test',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface ContentTypes {
      'admin::permission': AdminPermission;
      'admin::user': AdminUser;
      'admin::role': AdminRole;
      'admin::api-token': AdminApiToken;
      'admin::api-token-permission': AdminApiTokenPermission;
      'admin::transfer-token': AdminTransferToken;
      'admin::transfer-token-permission': AdminTransferTokenPermission;
      'plugin::upload.file': PluginUploadFile;
      'plugin::upload.folder': PluginUploadFolder;
      'plugin::ezforms.submission': PluginEzformsSubmission;
      'plugin::ezforms.recipient': PluginEzformsRecipient;
      'plugin::i18n.locale': PluginI18NLocale;
      'plugin::users-permissions.permission': PluginUsersPermissionsPermission;
      'plugin::users-permissions.role': PluginUsersPermissionsRole;
      'plugin::users-permissions.user': PluginUsersPermissionsUser;
      'api::collection1.collection1': ApiCollection1Collection1;
      'api::strapi-class-test.strapi-class-test': ApiStrapiClassTestStrapiClassTest;
      'api::strapi-components-test.strapi-components-test': ApiStrapiComponentsTestStrapiComponentsTest;
      'api::strapi-css-rule-test.strapi-css-rule-test': ApiStrapiCssRuleTestStrapiCssRuleTest;
      'api::strapi-field-test.strapi-field-test': ApiStrapiFieldTestStrapiFieldTest;
      'api::strapi-filter-sort-page-test.strapi-filter-sort-page-test': ApiStrapiFilterSortPageTestStrapiFilterSortPageTest;
      'api::strapi-into-test.strapi-into-test': ApiStrapiIntoTestStrapiIntoTest;
      'api::strapi-relation-test-a.strapi-relation-test-a': ApiStrapiRelationTestAStrapiRelationTestA;
      'api::strapi-relation-test-b.strapi-relation-test-b': ApiStrapiRelationTestBStrapiRelationTestB;
      'api::strapi-repeatable-test.strapi-repeatable-test': ApiStrapiRepeatableTestStrapiRepeatableTest;
      'api::strapi-single-type-class-test.strapi-single-type-class-test': ApiStrapiSingleTypeClassTestStrapiSingleTypeClassTest;
      'api::strapi-single-type-components-test.strapi-single-type-components-test': ApiStrapiSingleTypeComponentsTestStrapiSingleTypeComponentsTest;
      'api::strapi-single-type-css-rule-test.strapi-single-type-css-rule-test': ApiStrapiSingleTypeCssRuleTestStrapiSingleTypeCssRuleTest;
      'api::strapi-single-type-field-test.strapi-single-type-field-test': ApiStrapiSingleTypeFieldTestStrapiSingleTypeFieldTest;
      'api::strapi-single-type-into-test.strapi-single-type-into-test': ApiStrapiSingleTypeIntoTestStrapiSingleTypeIntoTest;
      'api::strapi-single-type-relation-test.strapi-single-type-relation-test': ApiStrapiSingleTypeRelationTestStrapiSingleTypeRelationTest;
      'api::strapi-single-type-repeatable-test.strapi-single-type-repeatable-test': ApiStrapiSingleTypeRepeatableTestStrapiSingleTypeRepeatableTest;
    }
  }
}
