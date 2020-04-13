interface Memory {
  username?: string;
}

if (!Memory.username) {
  const struc: StructureController | undefined = _.find(
    Game.structures,
    s => s instanceof StructureController,
  ) as StructureController;
  const creep = _.find(Game.creeps);
  Memory.username =
    (struc && struc.owner && struc.owner.username) ||
    (creep && creep.owner.username);
}

const USERNAME = Memory.username;
const PUBLIC_ACCOUNT = USERNAME === 'Quorum';

const TICKS_BETWEEN_ALERTS = 3000;

const MAX_INTEL_TARGETS = 50;

// How many ticks after a unowned room was signed to sign it again in ticks
const CONTROLLER_RESIGN_COOLDOWN = 100000;

const PRIORITIES = {
  DEFAULT: 6,
  CREEP: {
    DEFAULT: 4,
    UPGRADER: 6,
    FACTOTUM: 7,
    SPOOK: 6,
    REPLENISHER: 6,
  },
  FORTIFY: 6,
  MINE: 6,

  SPAWNS: 3,
  DEFENSE: 3,

  EMPIRE_INTEL: 4,

  PUBLICWORKS: 7,
  EXPAND: 8,
  PLAYER: 8,
  CITY: 8,
  CITY_LABS: 8,

  CONSTRUCTION: 9,
  CITY_REBOOT: 9,
  EMPIRE_MARKET: 10,
  RESPAWNER: 12,
  MAINTENANCE: 12,
};

const MARKET = {
  STATS: {
    // how often it gets recorded.
    INTERVAL: 750,
    // Interval * Max Records == length of history saved
    MAX_RECORDS: 50,
    // Percentage of records to drop. This prevents outliers from skewing results.
    DROP: 0.1,
  },
};

type Minerals = {
  EXTRACTABLE: ResourceConstant[];
  INGREDIENTS: {
    [name: string]: string[];
  };
};

const MINERALS: Minerals = {
  EXTRACTABLE: [
    RESOURCE_HYDROGEN,
    RESOURCE_OXYGEN,
    RESOURCE_UTRIUM,
    RESOURCE_LEMERGIUM,
    RESOURCE_KEANIUM,
    RESOURCE_ZYNTHIUM,
    RESOURCE_CATALYST,
  ],
  INGREDIENTS: {},
};

const primaryIngredients = Object.keys(REACTIONS);
for (const primaryIngredient of primaryIngredients) {
  const secondaryIngredients = Object.keys(REACTIONS[primaryIngredient]);
  for (const secondaryIngredient of secondaryIngredients) {
    const product = REACTIONS[primaryIngredient][secondaryIngredient];
    MINERALS.INGREDIENTS[product] = [primaryIngredient, secondaryIngredient];
  }
}

// Which priorities to monitor.
const MONITOR = {
  PRIORITIES: _.uniq([PRIORITIES.CREEP.DEFAULT, PRIORITIES.DEFAULT, 9]),
};

const AGGRESSION = {
  ATTACK: 1,
  HARASS: 2,
  STEAL: 3,
  RESERVE: 4,
  CLAIM: 5,
  INVADE: 6,
  BLOCK_UPGRADE: 7,
  TRIGGER_SAFEMODE: 8,
  RAZE: 9,
  SCORES: [1, 5, 5, 10, 10, 50, 100, 500, 1000],
};

const TERMINAL_ENERGY = 20000;
