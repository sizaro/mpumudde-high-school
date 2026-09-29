import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  listForUser(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async markRead(userId: string, id: string) {
    await this.prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true, readAt: new Date() },
    });
    // A school-authored communication can use Notification as its portal
    // delivery channel. Mirror the read state without collapsing the two
    // domains into one table.
    await this.prisma.communicationRecipient.updateMany({
      where: { portalNotificationId: id },
      data: { portalStatus: 'READ' },
    });
    return this.listForUser(userId);
  }

  async notifyDirectors(data: {
    type: string;
    title: string;
    message: string;
    entityType?: string;
    entityId?: string;
    link?: string;
  }) {
    const directors = await this.prisma.user.findMany({
      where: { isActive: true, roles: { some: { role: { name: 'SUPER_ADMIN' } } } },
      select: { id: true },
    });
    if (!directors.length) return;
    await this.prisma.notification.createMany({
      data: directors.map(({ id: userId }) => ({ userId, ...data })),
    });
  }
}
