import * as OBC from "openbim-components"

/**
 * class to control stable diffusion settings for request
 */
export class SettingsUIComponent extends OBC.SimpleUIComponent {
    onclick = new OBC.Event()
    constructor(components: OBC.Components) {
        const template = `
        <div id="shortcut-container" style="color: white; background-color: transparent; width: 100%; height: 100%; border: none; padding: 0px; box-sizing: border-box; display: flex; flex-direction: column; row-gap: 25px;">
            
        </div>
        `
        super(components, template)
    }
}



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