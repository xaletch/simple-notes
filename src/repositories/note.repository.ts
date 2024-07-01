import connection from '../db/index';
import Note from '../models/note.model';
import { OkPacket } from 'mysql2';

interface INoteRepository {
  create(note: Note): Promise<Note>;
  retrieveAll(searchParams: { title: string; created_at: Date }): Promise<Note[]>;
  retrieveById(noteId: number): Promise<Note | undefined>;
  update(note: Note): Promise<number>;
  delete(noteId: number): Promise<number>;
}

class NoteRepository implements INoteRepository {
  create(note: Note): Promise<Note> {
    return new Promise((resolve, rej) => {
      connection.query<OkPacket>(
        'INSERT INTO notes (title, description, created_at  ) VALUES(?,?,?)',
        [note.title, note.description, note.created_at],
        (err, res) => {
          if (err) {
            rej(err);
          } else {
            this.retrieveById(res.insertId)
              .then((note) => resolve(note!))
              .catch(rej);
          }
        },
      );
    });
  }
  retrieveAll(searchParams: { title: string; created_at: Date }): Promise<Note[]> {
    let query: string = 'SELECT * FROM notes';
    let conditions: string[] = [];

    if (searchParams.title) {
      conditions.push(`LOWER(title) LIKE '%${searchParams.title.toLowerCase()}%'`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    return new Promise((resolve, reject) => {
      connection.query<Note[]>(query, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }
  retrieveById(noteId: number): Promise<Note | undefined> {
    return new Promise((resolve, rej) => {
      connection.query<Note[]>('SELECT * FROM notes WHERE id = ?', [noteId], (err, res) => {
        if (err) {
          rej(err);
        } else {
          resolve(res?.[0]);
        }
      });
    });
  }
  update(note: Note): Promise<number> {
    return new Promise((resolve, rej) => {
      connection.query<OkPacket>(
        'UPDATE notes SET title = ?, description = ? WHERE id = ?',
        [note.title, note.description, note.id],
        (err, res) => {
          if (err) {
            rej(err);
          } else {
            resolve(res.affectedRows);
          }
        },
      );
    });
  }
  delete(noteId: number): Promise<number> {
    return new Promise((resolve, rej) => {
      connection.query<OkPacket>('DELETE FROM notes WHERE id = ?', [noteId], (err, res) => {
        if (err) {
          rej(err);
        } else {
          resolve(res.affectedRows);
        }
      });
    });
  }
}
export default new NoteRepository();
