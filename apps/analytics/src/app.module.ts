import { Module } from '@nestjs/common';
import { AnalyticsModule } from './analytics/analytics.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import postgresConfig from './analytics/config/postgres.config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Module({
  imports: [
    AnalyticsModule,
    ConfigModule.forRoot({ isGlobal: true, load: [postgresConfig] }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        let obj: TypeOrmModuleOptions = {
          type: 'postgres',
          host: configService.get('postgres.host'),
          port: configService.get('postgres.port'),
          database: configService.get('postgres.database'),
          username: configService.get('postgres.username'),
          password: configService.get('postgres.password'),
          autoLoadEntities: true,
          synchronize: false,
        };
        if (configService.get('STAGE') === 'local') obj = Object.assign(obj, { logging: true, synchronize: true });

        return obj;
      },
    }),
  ],
})
export class AppModule {}