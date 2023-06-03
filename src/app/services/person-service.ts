import { Injectable } from "@angular/core";
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/compat/firestore";
import { Person } from "../models/person";

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private dbPath = '/people';

  peopleCollection: AngularFirestoreCollection<Person>;

  constructor(private db: AngularFirestore) {
    this.peopleCollection = db.collection(this.dbPath);

  }

  public create(person: Person): any {
    return this.peopleCollection.add({ ...person });

  }

  public read(id: string): any {
    return this.peopleCollection.doc(id).get();

  }

  public update(id: string, data: any): Promise<void> {
    return this.peopleCollection.doc(id).update(data);

  }

  public delete(id: string): Promise<void> {
    return this.peopleCollection.doc(id).delete();

  }

  public getAll(): AngularFirestoreCollection<Person> {
    return this.peopleCollection;

  }

}
