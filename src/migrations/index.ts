import * as migration_20261018_113204_initial from './20261018_113204_initial';
import * as migration_20261018_131450_blob_storage_fields from './20261018_131450_blob_storage_fields';

export const migrations = [
  {
    up: migration_20261018_113204_initial.up,
    down: migration_20261018_113204_initial.down,
    name: '20261018_113204_initial',
  },
  {
    up: migration_20261018_131450_blob_storage_fields.up,
    down: migration_20261018_131450_blob_storage_fields.down,
    name: '20261018_131450_blob_storage_fields'
  },
];
