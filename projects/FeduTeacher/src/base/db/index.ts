export default class Db {
  db!: IDBDatabase;
  constructor() {
    this.init();
  }
  init(): void {
    const dbRequest: IDBOpenDBRequest = indexedDB.open("jsyTeacher", 1);
    dbRequest.onerror = (event) => {
      console.error("打开数据库失败", event);
    };
    dbRequest.onsuccess = () => {
      console.log("打开数据库成功", dbRequest.result);
      this.db = dbRequest.result;
    };
    dbRequest.onupgradeneeded = (event: Event) => {
      if (event.target) {
        this.db = (event.target as any).result;
      }
      if (!this.db.objectStoreNames.contains("system")) {
        const store = this.db.createObjectStore("system", {
          autoIncrement: true,
        });
        store.createIndex("key", "key", { unique: false });
        store.createIndex("name", "name", { unique: false });
      }
    };
  }
  createStore(name: string, index: string[]): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.db.objectStoreNames.contains(name)) {
        const store = this.db.createObjectStore(name, {
          autoIncrement: true,
        });
        index.forEach((key) => {
          store.createIndex(key, key, { unique: false });
        });
        resolve("数据表新增成功");
      } else {
        reject("数据表已存在");
      }
    });
  }
  add<V>(key: string, value: V): Promise<string> {
    return new Promise((resolve, reject) => {
      const dbRequest: IDBRequest = this.db
        .transaction([key], "readwrite")
        .objectStore(key)
        .add(value);
      dbRequest.onsuccess = () => {
        resolve("数据写入成功");
      };
      dbRequest.onerror = () => {
        reject("数据写入失败");
      };
    });
  }
  getData<V>(key: string, index?: string): Promise<V | V[]> {
    return new Promise((resolve, reject) => {
      const transaction: IDBTransaction = this.db.transaction(
        [key],
        "readonly"
      );
      const store: IDBObjectStore = transaction.objectStore(key);

      if (index) {
        const dataIndex: IDBIndex = store.index("key");
        const dbRequest: IDBRequest = dataIndex.get(index);

        dbRequest.onsuccess = (e) => {
          const result = (e.target as any).result;
          if (result) {
            resolve(result);
          } else {
            reject();
          }
        };
      } else {
        const dbRequest: IDBRequest = store.getAll();
        dbRequest.onsuccess = () => {
          resolve(dbRequest.result);
        };
        dbRequest.onerror = () => {
          reject();
        };
      }
    });
  }
}
