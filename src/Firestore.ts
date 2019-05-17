var properties = PropertiesService.getScriptProperties();

declare namespace FirestoreApp {
  function getFirestore(email:string, key: string, projectId): any;
}

export class Firestore {

  firestore: any;

  // buildConfig
  // DEV or PROD
  constructor(buildConfig: string) {
    let email: string = properties.getProperty(`${buildConfig}_EMAIL`);
    let key: string = properties.getProperty(`${buildConfig}_KEY`).replace(/\\n/g, '\n');
    let id: string = properties.getProperty(`${buildConfig}_PROJECTID`);
    this.firestore = FirestoreApp.getFirestore(email, key, id);
  }

  public createFirestore(path: string, data: object) {
    this.firestore.createDocument(path, data);
  }

  public updateFirestore(path: string, data: object) {
    this.firestore.updateDocument(path, data);
  }
}