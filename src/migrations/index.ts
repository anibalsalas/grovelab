import * as migration_20261026_024855 from './20261026_024855';
import * as migration_20261026_034526 from './20261026_034526';

export const migrations = [
  {
    up: migration_20261026_024855.up,
    down: migration_20261026_024855.down,
    name: '20261026_024855',
  },
  {
    up: migration_20261026_034526.up,
    down: migration_20261026_034526.down,
    name: '20261026_034526'
  },
];
