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
        this._currentSettings = {
            negativePrompt: this.getInnerElement("negative-prompt")!.textContent as string,
            width: this.getInnerElement("width")!.textContent as string,
            height: this.getInnerElement("height")!.textContent as string,
        }
        this._settingsDB = new RenderSettingsDB(this._currentSettings)
    }

    update() {
        this._settingsDB.update(this._currentSettings)
    }

    getRenderSettings(): ISettings {
        return this._settingsDB.db.settings.toArray()[0]
    }
}

// TODO: need to setup a DB for settings so they are remembered when user refreshes

// key: APIKey,
// prompt: prompt,
// negative_prompt: "bad quality",
// init_image: uploadedImageURL,
// width: "800",
// height: "800",
// samples: "1",
// temp: false,
// safety_checker: false,
// strength:0.7,
// seed: null,
// webhook: null,
// track_id: null,