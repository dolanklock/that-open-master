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
    this.update(renderSettings)
  }

  async init() {
    await this.db.open();
  }

  async update(renderSettings: ISettings) {
    try {
        // need to clear data and re-add everytime. if use add everytime page refresh will add a new one if this mehtod is called in a constructor somewhere
        this.db.settings.clear()
        this.db.settings.add({ ...renderSettings });
    } catch (error) {
        alert(`Error updating render settings ${error}`)
    }
  }

  async clear() {
    await this.db.settings.clear();
  }
}
