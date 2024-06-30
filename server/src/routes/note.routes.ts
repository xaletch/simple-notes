import { Router } from 'express';
import NoteController from '../controllers/note.controllers';

class NoteRoutes {
  public router: Router;
  private controller: NoteController;

  constructor() {
    this.router = Router();
    this.controller = new NoteController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/create', this.controller.create.bind(this.controller));
    this.router.get('/', this.controller.findAllNote.bind(this.controller));
    this.router.get('/:id', this.controller.findOneNote.bind(this.controller));
    this.router.post('/update/:id', this.controller.updateNote.bind(this.controller));
    this.router.delete('/delete/:id', this.controller.deleteNote.bind(this.controller));
  }
}

export default new NoteRoutes().router;
