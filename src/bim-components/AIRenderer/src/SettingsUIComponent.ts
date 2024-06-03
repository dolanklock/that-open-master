import * as OBC from "openbim-components"
import { RenderSettingsDB, ISettings } from "./DataBase/RenderSettingsDB"
/**
 * class to control stable diffusion settings for request
 */
export class SettingsUIComponent extends OBC.SimpleUIComponent {
    onclick = new OBC.Event()
    private _settingsDB: RenderSettingsDB
    private _currentSettings: ISettings 
    constructor(components: OBC.Components) {
        const template = `
        <div id="settings-container">
            <label>Negative Prompt</label>
            <textarea id="negative-prompt"></textarea>
            <label>Width</label>
            <input id="width"></input>
            <label>Height</label>
            <input id="height"></input>

        </div>
        `
        super(components, template)
        this.get().style.width = "100%"
        this.get().style.height = "100%"
        this.get().style.display = "flex"
        this.get().style.flexDirection = "column"
        this.get().style.rowGap = "10px"
        this.get().style.padding = "25px"
        this.getInnerElement("negative-prompt")!.textContent = "Bad quality, blurry, bad texture"
        this.getInnerElement("width")!.textContent = "800"
        this.getInnerElement("height")!.textContent = "800"
        this._updateCurrentSettings()
        this._settingsDB = new RenderSettingsDB(this._currentSettings)
        // TODO: need to make so that everytime page is refreshed then the values from db are used for input values in settings dialog
    }

    private _updateCurrentSettings() {
        this._currentSettings = {
            negativePrompt: (this.getInnerElement("negative-prompt") as HTMLTextAreaElement).value,
            width: (this.getInnerElement("width") as HTMLTextAreaElement).value,
            height: (this.getInnerElement("height") as HTMLTextAreaElement).value,
        }
    }

    async update() {
        this._updateCurrentSettings()
        await this._settingsDB.update(this._currentSettings)
        console.log("UPDATED SETTINGS", this._settingsDB.db.settings.toArray())
    }

    getRenderSettings(): ISettings {
        return this._settingsDB.db.settings.toArray()[0]
    }

    clearSettings() {
        this._settingsDB.db.settings.clear()
    }
}
