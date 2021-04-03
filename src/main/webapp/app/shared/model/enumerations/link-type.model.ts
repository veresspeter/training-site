export class LinkType {
  public static ONLINE = new LinkType('ONLINE', 'Online');
  public static STUDIO = new LinkType('STUDIO', 'Stúdió');
  public static MARGARET_ISLAND = new LinkType('MARGARET_ISLAND', 'Margit-sziget');
  public static OTHER = new LinkType('OTHER', 'Egyéb');

  public get Value(): string {
    return this.value;
  }
  public get Name(): string {
    return this.name;
  }

  constructor(private value: string, private name: string) {}

  public static parse(value: string): LinkType {
    switch (value) {
      case this.ONLINE.Value: {
        return this.ONLINE;
      }
      case this.STUDIO.Value: {
        return this.STUDIO;
      }
      case this.MARGARET_ISLAND.Value: {
        return this.MARGARET_ISLAND;
      }
      default: {
        return this.OTHER;
      }
    }
  }

  public toString(): string {
    return this.value;
  }
}
