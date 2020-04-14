type HasPos = RoomPosition | { pos: RoomPosition };

interface Creep {
  travelTo(target: HasPos, opts?: MoveToOpts): ScreepsReturnCode;
  isStuck(): boolean;
  __moveToOriginal(x: number, y: number, opts?: MoveToOpts): ScreepsReturnCode;
  __moveToOriginal(target: HasPos, opts?: MoveToOpts): ScreepsReturnCode;
}

Creep.prototype.travelTo = function(pos, opts = {}) {
  return OK;
};

Creep.prototype.isStuck = function() {
  return false;
};

if (!Creep.prototype.__moveToOriginal) {
  Creep.prototype.__moveToOriginal = Creep.prototype.moveTo;
  // TODO override moveTo here.
}
