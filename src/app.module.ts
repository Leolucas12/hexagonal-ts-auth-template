import { ExceptionInterceptor } from '@libs/application/interceptors/exception.interceptor';
import { UserModule } from '@modules/user/user.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { GraphQLModule } from '@nestjs/graphql';
import { RequestContextModule } from 'nestjs-request-context';
import { ContextInterceptor } from './libs/application/context/ContextInterceptor';
import { AuthModule } from './modules/auth/auth.module';

const interceptors = [
  {
    provide: APP_INTERCEPTOR,
    useClass: ContextInterceptor,
  },
  {
    provide: APP_INTERCEPTOR,
    useClass: ExceptionInterceptor,
  },
];

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    RequestContextModule,
    CqrsModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),

    // Modules
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [...interceptors],
})
export class AppModule {}
