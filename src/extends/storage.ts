interface StructureStorage {
  getLink: () => StructureTerminal | StructureStorage | undefined;
}
