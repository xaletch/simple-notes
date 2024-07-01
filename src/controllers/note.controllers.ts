import { Request, Response } from 'express';
import Note from '../models/note.model';
import noteRepository from '../repositories/note.repository';

export default class NoteController {
  async create(req: Request, res: Response) {
    if (!req.body.title) {
      res.status(400).send({
        message: 'Введите название заметки!',
      });
      return;
    }

    try {
      const note: Note = req.body;
      const createNote = await noteRepository.create(note);

      // console.log(createNote);
      res.status(200).send(createNote);
    } catch (err) {
      console.log(err);

      res.status(500).send({
        message: 'При создании заметки произошла ошибка.',
      });
    }
  }

  async findAllNote(req: Request, res: Response) {
    const title = typeof req.query.title === 'string' ? req.query.title : '';

    try {
      const notes = await noteRepository.retrieveAll({
        title: title,
        created_at: new Date(),
      });

      res.status(200).send(notes);

      // console.log(notes);
    } catch (err) {
      console.log(err);

      res.status(500).send({ message: 'Не удалось получить заметки.' });
    }
  }
  async findOneNote(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);

    try {
      const note = await noteRepository.retrieveById(id);

      if (note) {
        res.status(200).send(note);
      } else {
        res.status(404).send({ message: 'При получении заметки произошла ошибка.' });
      }

      // console.log(note);
    } catch (err) {
      console.log(err);

      res.status(500).send({ message: 'Не удалось получить одну заметку.' });
    }
  }
  async updateNote(req: Request, res: Response) {
    let note: Note = req.body;
    note.id = parseInt(req.params.id);

    try {
      const num = await noteRepository.update(note);

      if (num == 1) {
        res.status(200).send({ message: `Заметка успешно обновлена.` });
      } else {
        res.status(404).send({ message: `Заметка ${note.id} не найдена.` });
      }
    } catch (err) {
      console.log(err);

      res.status(500).send({ message: `Не удалось обновить заметку id которого = ${note.id}.` });
    }
  }
  async deleteNote(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);

    try {
      const num = await noteRepository.delete(id);

      if (num == 1) {
        res.status(200).send({ message: 'Заметка успешно удалена.' });
      } else {
        res.status(404).send({ message: `Заметка ${id} не найдена.` });
      }
    } catch (err) {
      console.log(err);

      res.status(500).send({ message: `Не удалось удалить заметку с id = ${id}.` });
    }
  }
}
