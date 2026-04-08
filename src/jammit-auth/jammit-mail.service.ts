import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class JammitMailService {
  private readonly log = new Logger(JammitMailService.name);

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {}

  async sendHtml(to: string, subject: string, html: string): Promise<void> {
    const apiKey = this.config.get<string>('RESEND_API_KEY');
    const from = this.config.get<string>('RESEND_FROM_EMAIL') ?? 'noreply@jammit.com';
    if (!apiKey) {
      this.log.warn(`[이메일 스킵·RESEND_API_KEY 없음] to=${to} subject=${subject}`);
      return;
    }
    await firstValueFrom(
      this.http.post(
        'https://api.resend.com/emails',
        { from, to: [to], subject, html },
        { headers: { Authorization: `Bearer ${apiKey}` } },
      ),
    );
  }
}
