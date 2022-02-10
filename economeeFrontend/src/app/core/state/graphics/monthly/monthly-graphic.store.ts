import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { MonthlyGraphic } from './monthly-graphic.model';

export interface MonthlyGraphicsState extends EntityState<MonthlyGraphic> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'MonthlyGraphics' })
export class MonthlyGraphicStore extends EntityStore<MonthlyGraphicsState> {

  constructor() {
    super();
  }

}
