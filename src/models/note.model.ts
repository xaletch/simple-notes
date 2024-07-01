import { RowDataPacket } from 'mysql2';

export default interface Note extends RowDataPacket {
  id?: number;
  title?: string;
  description?: string;
  created_at?: Date;
}
