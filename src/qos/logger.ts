const LOG_FATAL = 5;
const LOG_ERROR = 4;
const LOG_WARN = 3;
const LOG_INFO = 2;
const LOG_DEBUG = 1;
const LOG_TRACE = 0;

const NOTIFY_RATELIMIT = 1500;
const ERROR_COLORS = {
  5: '#ff0066',
  4: '#e65c00',
  3: '#809fff',
  2: '#999999',
  1: '#737373',
  0: '#666666',
  highlight: '#ffff00',
};

class Logger {
  defaultLogGroup: string;

  constructor() {
    this.defaultLogGroup = 'default';
  }

  log(
    message: string,
    severity: number = 3,
    group?: string,
    tags: string[] = [],
  ) {
    if (!group) group = this.defaultLogGroup;

    if (message.includes('RangeError: Array buffer allocation failed')) {
      group = 'ivm';
      message = 'RangeError: Array buffer allocation failed';
    }

    if (group !== 'default')
      message = `[${Game.shard.name}] ${group}: ${message}`;
    else message = `[${Game.shard.name}] ${message}`;
  }
}
