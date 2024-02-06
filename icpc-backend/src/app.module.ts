import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { DataSource } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { CategoriesModule } from './categories/categories.module';
import { NotesModule } from './notes/notes.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Danger1.',
      database: 'icpc-backend',
      synchronize: true,
      autoLoadEntities: true
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    CategoriesModule,
    NotesModule,
    CommentModule
  ]
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
