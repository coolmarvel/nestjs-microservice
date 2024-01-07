import { Controller } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @EventPattern('video_downloaded')
  async handleVideoDownloaded(@Payload() message: any) {
    console.log(message);
    this.analyticsService.updateVideoDownloadCnt(message.id);
  }
}
