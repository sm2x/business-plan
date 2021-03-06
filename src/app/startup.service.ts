import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Injectable} from '@angular/core';
import {Startup} from './models/startup.models';
import {Observable} from 'rxjs';
import {UserService} from './user/user.service';
import {Category} from './models/market.models';

@Injectable({providedIn: 'root'})
export class StartupService {

  startup$: AngularFirestoreCollection<Startup>;
  category$: AngularFirestoreCollection<Category>;

  constructor(private db: AngularFirestore, private userService: UserService) {
    this.bootstrapFirestore();
  }

  private bootstrapFirestore() {
    this.startup$ = this.db.collection<Startup>('/startup');
    this.category$ = this.db.collection<Category>('/categories');
  }

  create(startup: Startup): Promise<void> {
    const id: string = this.db.createId();
    startup.uid = id;
    startup.user_id = this.userService.getUserAuthenticated();
    return this.startup$.doc<Startup>(id).set(startup);
  }

  listAllStartupByUserId(): Observable<Startup[]> {

    return this.db
      .collection<Startup>('startup', ref =>
        ref.where('user_id', '==', this.userService.getUserAuthenticated()))
      .valueChanges();

  }

  listAllCategory(): Observable<Category[]> {
    return this.category$.valueChanges();
  }

  totalInvestments(startup: Startup): number {
    return startup.investments
      .map(value => value.value)
      .reduce((prev, value) => prev + value, 0);
  }

  totalCosts(startup: Startup): number {
    return startup.costs.map(value => value.value)
      .reduce((prev, value) => prev + value, 0);
  }

  update(data: Startup) {
    return this
      .startup$
      .doc<Startup>(data.uid)
      .update(data);
  }

  removeStartup(uid: string) {
    return this
      .startup$
      .doc<Startup>(uid)
      .delete();
  }
}
