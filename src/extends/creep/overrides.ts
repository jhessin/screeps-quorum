interface Creep {
  __claimOriginal(
    target: StructureController,
  ):
    | OK
    | ERR_NOT_OWNER
    | ERR_BUSY
    | ERR_INVALID_TARGET
    | ERR_FULL
    | ERR_NOT_IN_RANGE
    | ERR_TIRED
    | ERR_NO_BODYPART
    | ERR_GCL_NOT_ENOUGH;
  __buildOriginal(
    target: ConstructionSite,
  ):
    | OK
    | ERR_NOT_OWNER
    | ERR_BUSY
    | ERR_INVALID_TARGET
    | ERR_NOT_IN_RANGE
    | ERR_TIRED
    | ERR_NO_BODYPART
    | ERR_NOT_ENOUGH_ENERGY
    | ERR_RCL_NOT_ENOUGH;
}

interface Memory {
  construction: {
    [id: string]: number;
  };
}
if (!Creep.prototype.__claimOriginal) {
  Creep.prototype.__claimOriginal = Creep.prototype.claimController;
  Creep.prototype.claimController = function(controller) {
    const ret = this.__claimOriginal(controller);
    if (ret === OK) {
      Game.notify(`Claiming ${controller.room.name}`);
    }
    return ret;
  };
}

if (!Creep.prototype.__buildOriginal) {
  Creep.prototype.__buildOriginal = Creep.prototype.build;
  Creep.prototype.build = function(target) {
    const ret = this.__buildOriginal(target);
    if (ret === OK) {
      if (!Memory.construction) {
        Memory.construction = {};
      }
      Memory.construction[target.id] = Game.time;
    }
    return ret;
  };
}
