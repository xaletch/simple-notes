import { Application } from 'express';
import noteRoutes from './note.routes';

export default class Routes {
  constructor(app: Application) {
    this.configureRoutes(app);
  }

  private configureRoutes(app: Application) {
    app.use('/api/note', noteRoutes);
  }
}
