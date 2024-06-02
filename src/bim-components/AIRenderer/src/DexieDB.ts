import Dexie from "dexie";
import * as OBC from "openbim-components";

interface IRender {
    id?: number;
    buffer: ArrayBuffer;
  }

class GalleryDB extends Dexie {
  renders!: Dexie.Table<IRender, number>;

  constructor() {
    super("GalleryDB");
    this.version(1).stores({
      renders: "++id, buffer",
    });
  }
}

export class Gallery {
  db: GalleryDB;
  drawer: OBC.Drawer;

  constructor(viewer: OBC.Components) {
    this.db = new GalleryDB();
    this.db.version(1).stores({
      renders: "++id, buffer",
    });

    this.drawer = new OBC.Drawer(viewer);
    viewer.ui.add(this.drawer);
    this.drawer.alignment = "right";
    this.drawer.size = "15rem";
    this.drawer.visible = true;
    
  }

  async update() {
    this.clearDrawer();
    const allRenders = await this.db.renders.toArray();
    for(const {id, buffer} of allRenders) {
        if(id === undefined) {
            throw new Error("Item without ID!");
        } 
        
        const file = new File([new Blob([buffer])], id.toString());

        const img = document.createElement("img");
        img.src = URL.createObjectURL(file);;
        img.style.width = "13rem";
        
        const div = document.createElement("div");
        div.style.position = "relative";
        div.style.marginLeft = "1rem";  
        div.style.width = "13rem";
        div.style.marginTop = "1rem";  

        const x = document.createElement("div");
        x.textContent = "x";
        x.style.position = "absolute";
        x.style.right = "1rem";
        x.style.top = "1rem";
        x.style.cursor = "pointer";
        x.onclick = async () => {
            await this.db.renders.delete(id);
            await this.update();
        }

        const v = document.createElement("div");
        v.textContent = "v";
        v.style.position = "absolute";
        v.style.right = "2rem";
        v.style.top = "1rem";
        v.style.cursor = "pointer";
        v.onclick = async () => {
            const a = document.createElement("a");
            a.download = "render.jpg";
            a.href = URL.createObjectURL(file);
            a.click();
            a.remove();
        }

        div.appendChild(x);
        div.appendChild(v);
        div.appendChild(img);

        this.drawer.domElement.appendChild(div);
    }
  }

  async init() {
    await this.db.open();
  }

  async save(url: string) {
    const fetched = await fetch(url);
    const buffer = await fetched.arrayBuffer();
    await this.db.renders.add({ buffer });
  }

  async clear() {
    await this.db.renders.clear();
    this.clearDrawer();
  }

  private clearDrawer() {
    const children = [...this.drawer.domElement.children];
    for(const child of children) {
        child.remove();
    }
  }
}
