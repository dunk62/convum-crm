// Google Calendar and Gmail API service functions

const CALENDAR_API_BASE = 'https://www.googleapis.com/calendar/v3';
const GMAIL_API_BASE = 'https://www.googleapis.com/gmail/v1';

export interface CalendarEvent {
    id: string;
    summary: string;
    start: {
        dateTime?: string;
        date?: string;
    };
    end: {
        dateTime?: string;
        date?: string;
    };
    htmlLink?: string;
}

export interface GmailMessage {
    id: string;
    threadId: string;
    snippet: string;
    labelIds: string[];
    payload?: {
        headers: Array<{ name: string; value: string }>;
    };
    internalDate?: string;
}

export interface ParsedEmail {
    id: string;
    from: string;
    subject: string;
    snippet: string;
    time: string;
    important: boolean;
}

// Fetch upcoming calendar events
export async function fetchCalendarEvents(accessToken: string, maxResults = 10): Promise<CalendarEvent[]> {
    const now = new Date().toISOString();
    const oneWeekLater = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const params = new URLSearchParams({
        calendarId: 'primary',
        timeMin: now,
        timeMax: oneWeekLater,
        maxResults: maxResults.toString(),
        singleEvents: 'true',
        orderBy: 'startTime',
    });

    const response = await fetch(
        `${CALENDAR_API_BASE}/calendars/primary/events?${params}`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error(`Calendar API error: ${response.status}`);
    }

    const data = await response.json();
    return data.items || [];
}

// Fetch recent emails
export async function fetchEmails(accessToken: string, maxResults = 10): Promise<GmailMessage[]> {
    const params = new URLSearchParams({
        maxResults: maxResults.toString(),
        labelIds: 'INBOX',
    });

    const response = await fetch(
        `${GMAIL_API_BASE}/users/me/messages?${params}`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error(`Gmail API error: ${response.status}`);
    }

    const data = await response.json();
    const messages: GmailMessage[] = [];

    // Fetch full message details for each message
    for (const msg of (data.messages || []).slice(0, maxResults)) {
        const msgResponse = await fetch(
            `${GMAIL_API_BASE}/users/me/messages/${msg.id}?format=metadata&metadataHeaders=From&metadataHeaders=Subject`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        if (msgResponse.ok) {
            const msgData = await msgResponse.json();
            messages.push(msgData);
        }
    }

    return messages;
}

// Parse Gmail message to a simpler format
export function parseEmail(message: GmailMessage): ParsedEmail {
    const headers = message.payload?.headers || [];
    const fromHeader = headers.find(h => h.name.toLowerCase() === 'from');
    const subjectHeader = headers.find(h => h.name.toLowerCase() === 'subject');

    // Extract name from email address
    let fromName = fromHeader?.value || '알 수 없음';
    const emailMatch = fromName.match(/^([^<]+)</);
    if (emailMatch) {
        fromName = emailMatch[1].trim().replace(/"/g, '');
    } else if (fromName.includes('@')) {
        fromName = fromName.split('@')[0];
    }

    // Calculate relative time
    const internalDate = message.internalDate
        ? new Date(parseInt(message.internalDate))
        : new Date();
    const now = new Date();
    const diffMs = now.getTime() - internalDate.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    let timeAgo: string;
    if (diffMins < 60) {
        timeAgo = `${diffMins}분 전`;
    } else if (diffHours < 24) {
        timeAgo = `${diffHours}시간 전`;
    } else {
        timeAgo = `${diffDays}일 전`;
    }

    return {
        id: message.id,
        from: fromName,
        subject: subjectHeader?.value || '(제목 없음)',
        snippet: message.snippet,
        time: timeAgo,
        important: message.labelIds?.includes('IMPORTANT') || message.labelIds?.includes('STARRED') || false,
    };
}

// Format calendar event time
export function formatEventTime(event: CalendarEvent): string {
    const startDateTime = event.start.dateTime || event.start.date;
    if (!startDateTime) return '';

    const date = new Date(startDateTime);
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const dayName = days[date.getDay()];

    if (event.start.date && !event.start.dateTime) {
        // All-day event
        return `${dayName}요일 (종일)`;
    }

    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const period = hours >= 12 ? '오후' : '오전';
    const displayHour = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;

    return `${dayName}요일 ${period} ${displayHour}:${minutes}`;
}
