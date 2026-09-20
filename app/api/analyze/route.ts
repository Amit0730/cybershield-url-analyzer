import { NextRequest, NextResponse } from 'next/server';
import { analyzeUrl } from '@/lib/url-analyzer-engine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { url } = body;

    if (!url || typeof url !== 'string' || url.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please provide a valid URL string to analyze.',
        },
        { status: 400 }
      );
    }

    if (url.length > 2048) {
      return NextResponse.json(
        {
          success: false,
          error: 'URL exceeds maximum allowable length (2048 characters).',
        },
        { status: 400 }
      );
    }

    // Perform the complete multi-vector security analysis
    const result = await analyzeUrl(url);

    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
          'X-Content-Type-Options': 'nosniff',
        },
      }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred during analysis.';
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 400 }
    );
  }
}
