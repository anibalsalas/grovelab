import * as migration_20261026_024855 from './20261026_024855';
import * as migration_20261026_034526 from './20261026_034526';
import * as migration_20261027_024326 from './20261027_024326';
import * as migration_20261027_024419 from './20261027_024419';
import * as migration_20261027_025815 from './20261027_025815';
import * as migration_20261028_010205 from './20261028_010205';
import * as migration_20261028_031500 from './20261028_031500';

export const migrations = [
  {
    up: migration_20261026_024855.up,
    down: migration_20261026_024855.down,
    name: '20261026_024855',
  },
  {
    up: migration_20261026_034526.up,
    down: migration_20261026_034526.down,
    name: '20261026_034526',
  },
  {
    up: migration_20261027_024326.up,
    down: migration_20261027_024326.down,
    name: '20261027_024326',
  },
  {
    up: migration_20261027_024419.up,
    down: migration_20261027_024419.down,
    name: '20261027_024419',
  },
  {
    up: migration_20261027_025815.up,
    down: migration_20261027_025815.down,
    name: '20261027_025815',
  },
  {
    up: migration_20261028_010205.up,
    down: migration_20261028_010205.down,
    name: '20261028_010205',
  },
  {
    up: migration_20261028_031500.up,
    down: migration_20261028_031500.down,
    name: '20261028_031500',
  },
];
