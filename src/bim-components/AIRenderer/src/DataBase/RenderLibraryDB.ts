import Dexie from "dexie";
import * as OBC from "openbim-components";


interface IRender {
    id?: number,
    buffer: ArrayBuffer,
    title: string,
    date: string
  }

class GalleryDB extends Dexie {
  renders!: Dexie.Table<IRender, number>;

  constructor() {
    super("GalleryDB");
    this.version(1).stores({
      renders: "++id, title, date, buffer",
    });
  }
}

export class Gallery {
  db: GalleryDB;
  drawer: OBC.Drawer;

  constructor() {
    this.db = new GalleryDB();
    this.db.version(1).stores({
        renders: "++id, title, date, buffer",
    });
  }

  async init() {
    await this.db.open();
  }

  async save(url: string, title: string, date: string) {
    const fetched = await fetch(url);
    const buffer = await fetched.arrayBuffer();
    return await this.db.renders.add({ buffer, title, date });
  }

  async clear() {
    await this.db.renders.clear();
  }

  deleteRender(key: number) {
    this.db.renders.delete(key)
  }
}
