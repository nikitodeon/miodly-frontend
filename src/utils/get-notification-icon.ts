import { Bell, Check, Fingerprint, Medal, Radio, User } from 'lucide-react'

import { NotificationType } from '@/graphql/generated/output'

export function getNotificationIcon(type: NotificationType) {
	switch (type) {
		case NotificationType.EnableTwoFactor:
			return Fingerprint

		default:
			return Bell
	}
}
