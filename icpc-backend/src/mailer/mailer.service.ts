import { Injectable } from '@nestjs/common';
import { MailerService as NestMailerService } from '@nestjs-modules/mailer';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class MailerService {
  constructor(
    private readonly mailerService: NestMailerService,
    private readonly usersService: UsersService
  ) {}
  /*
  Input: 
    admins: boolean,
    cause: 'report' | 'create' | 'update' | 'delete',
    title: string,
    itemType: 'noticia' | 'ejercicio' | 'apunte' | 'reporte'
  Output: Promise<void>
  Return value: None (sends emails and logs results)
  Function: Sends notification emails to users based on the action (report, create, update, delete) and item type.
  Variables: addresses, address, error
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async sendMail(
    admins: boolean,
    cause: 'report' | 'create' | 'update' | 'delete',
    title: string,
    itemType: 'noticia' | 'ejercicio' | 'apunte' | 'reporte'
  ) {
    const addresses = await this.usersService.getMails(admins);
    switch (cause) {
      // If the cause is 'report', send a notification email with the title of the report
      case 'report':
        try {
          // Iterate through the list of addresses and send an email to each
          for (const address of addresses) {
            await this.mailerService.sendMail({
              to: address,
              from: '"Sistema de divulgación para competencias académicas" <sistema.divulgacion.icpc.uacam@gmail.com>',
              subject: 'Notificación',
              text: `Un alumno ha enviado un reporte de nombre "${title}".`,
              html: `<p>Un alumno ha enviado un reporte de nombre "${title}".</p>`
            });
          }
          console.log('Emails sent successfully');
        } catch (error) {
          console.log(error);
        }
        break;
      // If the cause is 'create', send a notification email with the title of the created item
      case 'create':
        try {
          // Iterate through the list of addresses and send an email to each
          for (const address of addresses) {
            await this.mailerService.sendMail({
              to: address,
              from: '"Sistema de divulgación para competencias académicas" <sistema.divulgacion.icpc.uacam@gmail.com>',
              subject: 'Notificación',
              // Conditional to select the appropriate text based on itemType
              text: `Un entrenador ha creado  ${
                itemType === 'noticia'
                  ? 'una nueva noticia'
                  : 'un nuevo ' + itemType
              } de nombre "${title}".`,
              html: `<p>Un entrenador ha creado  ${
                itemType === 'noticia'
                  ? 'una nueva noticia'
                  : 'un nuevo ' + itemType
              } de nombre "${title}".</p>`
            });
          }
          console.log('Email sent successfully');
        } catch (error) {
          console.log(error);
        }
        break;
      // If the cause is 'update', send a notification email with the title of the updated item
      case 'update':
        try {
          // Iterate through the list of addresses and send an email to each
          for (const address of addresses) {
            await this.mailerService.sendMail({
              to: address,
              from: '"Sistema de divulgación para competencias académicas" <sistema.divulgacion.icpc.uacam@gmail.com>',
              subject: 'Notificación',
              // Conditional to select the appropriate text based on itemType
              text: `Un entrenador ha modificado  ${
                itemType === 'noticia' ? 'una noticia' : 'un ' + itemType
              } de nombre "${title}".`,
              html: `<p>Un entrenador ha modificado  ${
                itemType === 'noticia' ? 'una noticia' : 'un ' + itemType
              } de nombre "${title}".</p>`
            });
          }
          console.log('Email sent successfully');
        } catch (error) {
          console.log(error);
        }
        break;
      // If the cause is 'delete', send a notification email with the title of the deleted item
      case 'delete':
        try {
          // Iterate through the list of addresses and send an email to each
          for (const address of addresses) {
            await this.mailerService.sendMail({
              to: address,
              from: '"Sistema de divulgación para competencias académicas" <sistema.divulgacion.icpc.uacam@gmail.com>',
              subject: 'Notificación',
              // Conditional to select the appropriate text based on itemType
              text: `Un entrenador ha eliminado  ${
                itemType === 'noticia' ? 'una noticia' : 'un ' + itemType
              } de nombre "${title}".`,
              html: `<p>Un entrenador ha eliminado  ${
                itemType === 'noticia' ? 'una noticia' : 'un ' + itemType
              } de nombre "${title}".</p>`
            });
          }
          console.log('Email sent successfully');
        } catch (error) {
          console.log(error);
        }
        break;
    }
  }
}
