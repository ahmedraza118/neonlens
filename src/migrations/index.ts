import * as migration_20261018_113204_initial from './20261018_113204_initial';
import * as migration_20261018_131450_blob_storage_fields from './20261018_131450_blob_storage_fields';
import * as migration_20261103_210221_localization_video_carousel from './20261103_210221_localization_video_carousel';
import * as migration_20261103_215652_localized_slugs from './20261103_215652_localized_slugs';

export const migrations = [
  {
    up: migration_20261018_113204_initial.up,
    down: migration_20261018_113204_initial.down,
    name: '20261018_113204_initial',
  },
  {
    up: migration_20261018_131450_blob_storage_fields.up,
    down: migration_20261018_131450_blob_storage_fields.down,
    name: '20261018_131450_blob_storage_fields',
  },
  {
    up: migration_20261103_210221_localization_video_carousel.up,
    down: migration_20261103_210221_localization_video_carousel.down,
    name: '20261103_210221_localization_video_carousel',
  },
  {
    up: migration_20261103_215652_localized_slugs.up,
    down: migration_20261103_215652_localized_slugs.down,
    name: '20261103_215652_localized_slugs'
  },
];
