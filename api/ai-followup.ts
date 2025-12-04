import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { content } = req.body;

    if (!content) {
        return res.status(400).json({ error: 'Content is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.error('GEMINI_API_KEY is not set');
        return res.status(500).json({ error: 'Server configuration error' });
    }

    try {
        const prompt = `너는 유능한 영업 비서야. 사용자가 입력한 미팅 내용을 바탕으로 향후 F/U(Follow-up)해야 할 핵심 내용을 4가지로 간략하게 요약해서 번호 매겨서 정리해줘.
각 항목은 군더더기 없이 핵심 행동이나 내용만 명확하게 작성해줘.
(미팅 내용에 기반하여) 와 같은 괄호 설명이나 부연 설명은 절대 포함하지 마.

반드시 아래 형식으로만 출력해줘:
F/U 제안
1. [핵심 내용]
2. [핵심 내용]
3. [핵심 내용]
4. [핵심 내용]

[미팅 내용]
${content}`;

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
        console.error('Error calling Gemini API:', error);
        return res.status(500).json({ error: 'AI processing failed: ' + error.message });
    }
}
