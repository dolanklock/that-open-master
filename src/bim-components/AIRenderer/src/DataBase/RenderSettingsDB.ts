import Dexie from "dexie";

export interface ISettings {
    id?: number,
    negativePrompt: string,
    width: string,
    height: string,
}

class DB extends Dexie {
    settings!: Dexie.Table<ISettings, number>;

  constructor() {
    super("DB");
    this.version(1).stores({
        settings: "++id, negativePrompt, width, height",
    });
  }
}

export class RenderSettingsDB {
  db: DB;
  constructor(renderSettings: ISettings) {
    this.db = new DB();
    this.db.version(1).stores({
        settings: "++id, negativePrompt, width, height",
    });
    const negativePrompt = renderSettings.negativePrompt
    const width = renderSettings.width
    const height = renderSettings.height
    this.db.settings.add({ negativePrompt, width, height});
  }

  async init() {
    await this.db.open();
  }

  async update(renderSettings: ISettings) {
    try {
        await this.db.settings.update(1, {...renderSettings})
    } catch (error) {
        alert(`Error updating render settings ${error}`)
    }
  }

  async clear() {
    await this.db.settings.clear();
  }
}
