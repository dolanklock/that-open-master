import  *  as OBC from "openbim-components"

export class StableDiffusionRender {
    proxyURL: string
    uploadURL: string
    processURL: string
    private _components: OBC.Components

    constructor(components: OBC.Components, proxyURL: string, uploadURL: string, processURL: string) {
        this._components = components
        this.processURL = processURL
        this.proxyURL = proxyURL
        this.uploadURL = uploadURL
    }
    /**
     * takes a screen shot of the viewer scene and returns the image as png
     * @returns 
     */
    private _takeScreenshot() {
        const postproductionRenderer = this._components.renderer as OBC.PostproductionRenderer
        console.log("HERE", postproductionRenderer)
        postproductionRenderer.postproduction.composer.render()
        const renderer = postproductionRenderer.get();
        const image = renderer.domElement.toDataURL("image/png");
        return image
    }
    /**
     * uploads image to SD and gets the image url from it
     * @param APIKey 
     * @param image 
     * @returns 
     */
    private async _uploadRender(APIKey: string, image: string) {
        const url = this.proxyURL + this.uploadURL;
        const crop = "false";
        
        const req = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ APIKey, image, crop }),
        })
        const res = await req.json()
        const imageURL = res.link
        return imageURL
    }
    /**
     * sends post request to SD to render the image that we uploaded with the given prompt
     * @param APIKey 
     * @param prompt 
     * @returns 
     */
    async render(APIKey: string, prompt: string) {
        const image = this._takeScreenshot()
        const uploadedImageURL = await this._uploadRender(APIKey, image)
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const raw = JSON.stringify({
            key: APIKey,
            prompt: prompt,
            negative_prompt: "bad quality",
            init_image: uploadedImageURL,
            width: "800",
            height: "800",
            samples: "1",
            temp: false,
            safety_checker: false,
            strength:0.7,
            seed: null,
            webhook: null,
            track_id: null,
        });
        const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
        };
        const url = this.proxyURL + this.processURL
        const rawResponse = await fetch(url, requestOptions)
        console.log(rawResponse)
        const response = await rawResponse.json()
        console.log(response.output as string[])
        return response.output as string[]
    }
}