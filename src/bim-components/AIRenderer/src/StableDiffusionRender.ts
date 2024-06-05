import  *  as OBC from "openbim-components"

export class StableDiffusionRender {
    proxyURL: string
    uploadURL: string
    processURL: string
    negPrompt: string
    width: number
    height: number
    private _components: OBC.Components

    constructor(components: OBC.Components, proxyURL: string, uploadURL: string, processURL: string) {
        this._components = components
        this.processURL = processURL
        this.proxyURL = proxyURL
        this.uploadURL = uploadURL
        this.negPrompt = "bad quality, blurry"
        this.width = "800"
        this.height = "800"
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
    private async _uploadRender(key: string, image: string) {
        const url = this.proxyURL + this.uploadURL;
        const crop = "false";
        try {
            const rawUploadResponse = await fetch(url, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ key, image, crop }),
            });
            console.log("testing", rawUploadResponse)
            if (!rawUploadResponse.ok) {
                switch(rawUploadResponse.status) {
                    case 400:
                        throw new Error(`Bad response uploading render image to SD: ${rawUploadResponse.status}`)
                    case 401:
                        throw new Error(`Bad response uploading render image to SD: ${rawUploadResponse.status}`)
                    case 404:
                        throw new Error(`Bad response uploading render image to SD: ${rawUploadResponse.status}`)
                    case 500:
                        throw new Error(`Bad response uploading render image to SD: ${rawUploadResponse.status}`)  
                }
            } else {
                const uploadResponse = await rawUploadResponse.json();
                return uploadResponse.link
            }
        } catch (error) {
            throw error
        }
    }
    /**
     * sends post request to SD to render the image that we uploaded with the given prompt
     * @param APIKey 
     * @param prompt 
     * @returns 
     */
    async render(APIKey: string, prompt: string) {
        const image = this._takeScreenshot()
        // console.log("image", image)
        const uploadedImageURL = await this._uploadRender(APIKey, image)
        console.log("upload images", uploadedImageURL)
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const raw = JSON.stringify({
            key: APIKey,
            prompt: prompt,
            negative_prompt: this.negPrompt,
            init_image: uploadedImageURL,
            width: this.width,
            height: this.height,
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
        const response = await fetch(url, requestOptions)
        console.log("TEST", response)
        if (!response.ok) {
            switch(response.status) {
                case 400:
                    throw new Error(`Bad response fetching final image url: ${response.status}`)
                case 401:
                    throw new Error(`Bad response fetching final image url: ${response.status}`)
                case 404:
                    throw new Error(`Bad response fetching final image url: ${response.status}`)
                case 500:
                    throw new Error(`Bad response fetching final image url: ${response.status}`)  
            }
        } else {
            console.log("raw", response)
            const responseURLs = await response.json()
            console.log("responseURLs", responseURLs)
            // const resy = await fetch(responseURLs.fetch_result)
            // console.log("resy", resy)
            // console.log("resy", await resy.json())
            // let eta = responseURLs.eta * 1000
            // setTimeout(async () => {
            //     const responseFetched = await fetch(responseURLs.fetch_result)
            //     console.log("responseFetched", responseFetched)
            //     if (!responseFetched.ok) {
            //         throw new Error('Network response was not ok ' + responseFetched.statusText);
            //       } else {
            //         const result = responseFetched.json()
            //         console.log("result", result)
            //         return result
            //       }
                
            //   }, eta);
            
            return responseURLs.output as string[]
        }
        // console.log(response)
        // console.log("image here", response.output as string[])
        // return response.output as string[]
    }
}