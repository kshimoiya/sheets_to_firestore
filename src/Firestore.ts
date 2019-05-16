var properties = ScriptProperties.getProperties();

declare namespace FirestoreApp {
  function getFirestore(email:string, key: string, projectId): any;
}

class Firestore {

  firestore: any;

  // buildConfig
  // DEV or PROD
  constructor(buildConfig: string) {
    this.firestore = FirestoreApp.getFirestore(properties[`${buildConfig}_EMAIL`], properties[`${buildConfig}_KEY`], properties[`${buildConfig}_PROJECTID`]);
  }

  public createFirestore(path: string, data: object) {
    this.firestore.createDocument(path, data);
  }

  public updateFirestore(path: string, data: object) {
    this.firestore.updateDocument(path, data);
  }
}