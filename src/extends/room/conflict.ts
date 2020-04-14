interface Room {
  getPlayerHostiles(): Creep[];
  getHostilesByPlayer(): Creep[];
}

interface RoomConstructor {
  isPlayerHazard(creep: Creep): boolean;
  isPotentialHazard(creep: Creep): boolean;
}
