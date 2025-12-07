import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { content, prompt: customPrompt } = req.body;

    if (!content) {
        return res.status(400).json({ error: 'Content is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.error('GEMINI_API_KEY is not set');
        return res.status(500).json({ error: 'Server configuration error' });
    }

    try {
        // 사용자 정의 프롬프트가 있으면 사용, 없으면 기본 메모 정리 프롬프트 사용
        const prompt = customPrompt || `너는 유능한 영업 비서야. 다음 영업 메모를 깔끔하게 정리해줘.

## 정리 규칙:
1. 핵심 내용을 bullet point로 요약
2. 날짜, 담당자, 업체명 등 중요 정보 강조
3. 주요 액션 아이템이 있다면 "📌 액션 아이템" 섹션으로 분리
4. 간결하고 명확하게 작성
5. 불필요한 설명 없이 핵심만 작성

[메모 내용]
${content}

## 정리 결과:`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
            })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!aiResponse) {
            throw new Error('AI 응답을 받아오지 못했습니다.');
        }

        return res.status(200).json({ result: aiResponse });

    } catch (error: any) {
        console.error('Error calling Gemini API for summary:', error);
        return res.status(500).json({ error: 'AI processing failed: ' + error.message });
    }
}
