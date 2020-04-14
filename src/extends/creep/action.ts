interface Creep {
  recharge: () => ScreepsReturnCode;
  recycle: () => ScreepsReturnCode;
  transferAll: (target: Creep | PowerCreep | Structure) => ScreepsReturnCode;
}

interface CreepMemory {
  recharge: boolean;
}

Creep.prototype.recharge = function(): ScreepsReturnCode {
  // Check to see if creep needs to recharge
  if (this.carry[RESOURCE_ENERGY] <= 0) {
    this.memory.recharge = true;
  }
  if (this.carry[RESOURCE_ENERGY] >= this.carryCapacity * 0.75) {
    delete this.memory.recharge;
  }
  if (!this.memory.recharge) {
    return ERR_FULL;
  }

  // See if creep can get energy from storage, or as a fallback from terminal.
  let storage: StructureStorage | StructureTerminal | undefined;

  if (this.room.storage) {
    const storageLink = this.room.storage.getLink();
    if (
      storageLink &&
      storageLink.store.getUsedCapacity(RESOURCE_ENERGY) /
        storageLink.store.getCapacity(RESOURCE_ENERGY) >
        0.75
    ) {
      storage = storageLink;
    }
  }

  if (!storage) {
    if (this.room.storage && this.room.storage.store[RESOURCE_ENERGY]) {
      storage = this.room.storage;
    } else if (
      this.room.terminal &&
      this.room.terminal.store[RESOURCE_ENERGY]
    ) {
      storage = this.room.terminal;
    }
  }

  if (storage) {
    if (!this.pos.isNearTo(storage)) {
      this.travelTo(storage);
    }
    if (this.pos.isNearTo(storage)) {
      this.withdraw(storage, RESOURCE_ENERGY);
    }
    return OK;
  }
  // Create a bigger scope for this variable ( used here and in the filter in containers )
  const carryCap = this.carryCapacity;

  // Check for qualifying dropped energy.
  const resources: Resource[] = this.room.find(FIND_DROPPED_RESOURCES, {
    filter: (resource: Resource) => {
      if (
        resource.resourceType !== RESOURCE_ENERGY ||
        resource.amount < carryCap ||
        !resource.room
      ) {
        return false;
      }

      // Is resource on top of container?
      const structures = resource.pos.lookFor(LOOK_STRUCTURES);
      for (const structure of structures) {
        if (structure.structureType === STRUCTURE_CONTAINER) {
          return true;
        }
      }

      // Is the resource near the room storage?
      if (
        resource.room.storage &&
        resource.room.storage.pos.getRangeTo(resource) <= 2
      ) {
        return true;
      }

      // Is the resource on top of the suicide booth?
      const suicideBooth = resource.room.getSuicideBooth();
      if (suicideBooth && resource.pos.getRangeTo(suicideBooth) === 0) {
        return true;
      }

      return false;
    },
  });

  if (resources.length > 0) {
    const resource: Resource | null = this.pos.findClosestByRange(resources);
    // To make typescript happy
    if (!resource) return ERR_NOT_FOUND;

    if (!this.pos.isNearTo(resource)) {
      this.travelTo(resource);
    }
    if (this.pos.isNearTo(resource)) {
      this.pickup(resource);
    }
    return OK;
  }

  // If there is no storage check for containers.
  const containers = _.filter(
    this.room.structures[STRUCTURE_CONTAINER],
    a => a.store[RESOURCE_ENERGY] > Math.min(a.storeCapacity, carryCap),
  );
  if (containers.length > 0) {
    const container = this.pos.findClosestByRange(containers);
    if (!this.pos.isNearTo(container)) {
      this.travelTo(container);
    }
    if (this.pos.isNearTo(container)) {
      this.withdraw(container, RESOURCE_ENERGY);
    }
    return OK;
  }

  // As a last resort harvest energy from the active sources.
  if (this.getActiveBodyparts(WORK) <= 0) {
    // Still returning true because the creep still does need to recharge.
    return OK;
  }
  const sources = this.room.find(FIND_SOURCES_ACTIVE);
  if (sources.length <= 0) {
    // Still returning true since energy is still needed
    return OK;
  }

  sources.sort(
    (a, b) =>
      a.pos.getRangeTo(a.room.controller) - b.pos.getRangeTo(b.room.controller),
  );
  const idx = parseInt(this.name[this.name.length - 1], 36);
  const source = sources[idx % sources.length];
  if (!this.pos.isNearTo(source)) {
    this.travelTo(source);
  }
  if (this.pos.isNearTo(source)) {
    this.harvest(source);
  }
  return OK;
};

Creep.prototype.recycle = function() {
  return OK;
};

Creep.prototype.transferAll = function() {
  return OK;
};
