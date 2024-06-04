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
  constructor() {
    this.db = new DB();
    this.db.version(1).stores({
        settings: "++id, negativePrompt, width, height",
    });
    this.init()
  }

  getCurrentSettings() {
    const existingSettings = this.db.settings.toArray()[0]
    return existingSettings
  }

  async init() {
    await this.db.open()
    // below we are setting the values of the settings form with ones from db when page refreshes
    const settingsCurrent = await this.getCurrentSettings()
    this.update(settingsCurrent)
  }

  async update(renderSettings: ISettings) {
    try {
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
