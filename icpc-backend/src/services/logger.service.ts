import * as fs from 'fs';
import * as path from 'path';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LoggerService {
  private logFilePath = path.join(process.cwd(), 'src/services/changes.log'); // Ruta actualizada

  constructor() {
    // Crear el archivo de log si no existe
    if (!fs.existsSync(this.logFilePath)) {
      console.log(`Creating log file: ${this.logFilePath}`);
      fs.writeFileSync(this.logFilePath, '', 'utf-8');
    } else {
      console.log(`Log file already exists: ${this.logFilePath}`);
    }
  }

  logChange(module: string, action: string, userName: string, itemId: string) {
    const timestamp = new Date().toISOString();
    const logEntry = `${timestamp} - ${module} - ${action} - User: ${userName} - Item ID: ${itemId}`;

    try {
      console.log(`Attempting to write to log file: ${this.logFilePath}`);
      fs.appendFileSync(this.logFilePath, logEntry + '\n', 'utf-8');
      console.log(`Log entry created: ${logEntry}`);
    } catch (error) {
      console.error('Error writing to log file', error);
    }
  }

  logRead(module: string, itemId: string, category: string, tags: string) {
    const timestamp = new Date().toISOString();
    const currentMonth = new Date().toLocaleString('default', {
      month: 'long'
    });
    const currentYear = new Date().getFullYear();
    const logEntry = `${timestamp} - Type: ${module} - ID: ${itemId} - Category: ${category} - Tags: ${tags}`;
    try {
      console.log(
        `Attempting to write to log file: ${path.join(
          process.cwd(),
          `src/services/${currentMonth}-${currentYear}.log`
        )}`
      );
      fs.appendFileSync(
        path.join(
          process.cwd(),
          `src/services/${currentMonth}-${currentYear}.log`
        ),
        logEntry + '\n',
        'utf-8'
      );
      console.log(`Log entry created: ${logEntry}`);
    } catch (error) {
      console.error('Error writing to log file', error);
    }
  }
}
