import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { UAParser } from 'ua-parser-js';

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || '';
    
    // Parse user agent
    const parser = new UAParser(userAgent);
    const browser = parser.getBrowser();
    const os = parser.getOS();
    const device = parser.getDevice();

    const visitorData = {
      ip,
      browser: `${browser.name || 'Unknown'} ${browser.version || ''}`.trim(),
      os: `${os.name || 'Unknown'} ${os.version || ''}`.trim(),
      device: device.type || 'desktop',
      lastVisit: serverTimestamp(),
      userAgent
    };

    // Use IP as document ID to ensure uniqueness (1 IP = 1 visitor)
    // Replace dots/colons to make it a valid Firestore ID if needed, though Firestore allows them.
    const safeIp = ip.replace(/[\.\:]/g, '_');
    
    if (safeIp !== 'unknown') {
      const visitorRef = doc(db, 'visitors', safeIp);
      await setDoc(visitorRef, visitorData, { merge: true });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking visitor:', error);
    return NextResponse.json({ success: false, error: 'Failed to track' }, { status: 500 });
  }
}
