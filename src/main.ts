if (Game.cpu.bucket < 500) {
  throw new Error('Extremely low bucket - aborting script run at top level');
}

import { ErrorMapper } from 'utils/ErrorMapper';
import 'constants';

const QosLogger = require('qos/logger');
const Logger = new QosLogger();

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  console.log(`Current game tick is ${Game.time}`);

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
});
