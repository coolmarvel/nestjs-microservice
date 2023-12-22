import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Module({
  providers: [
    VideoService,
    {
      provide: 'VIDEO_SERVICE',
      useFactory: () => {
        return ClientProxyFactory.create({ transport: Transport.TCP, options: { host: 'video-service', port: 3002 } });
      },
    },
  ],
  controllers: [VideoController],
})
export class VideoModule {}
