export default async function handler(req, res) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { code } = req.query;

    if (!code) {
        return res.status(400).json({ error: 'No authorization code provided' });
    }

    const CLIENT_ID = process.env.OSU_CLIENT_ID;
    const CLIENT_SECRET = process.env.OSU_CLIENT_SECRET;
    const REDIRECT_URI = process.env.REDIRECT_URI || 'https://osu-bet.xyz/callback.html';

    console.log('Environment check:', {
        hasClientId: !!CLIENT_ID,
        hasClientSecret: !!CLIENT_SECRET,
        redirectUri: REDIRECT_URI
    });

    if (!CLIENT_ID || !CLIENT_SECRET) {
        return res.status(500).json({ 
            error: 'Server configuration error',
            debug: {
                hasClientId: !!CLIENT_ID,
                hasClientSecret: !!CLIENT_SECRET
            }
        });
    }

    try {
        const response = await fetch('https://osu.ppy.sh/oauth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                code: code,
                grant_type: 'authorization_code',
                redirect_uri: REDIRECT_URI
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('osu! API error:', data);
            return res.status(response.status).json(data);
        }

        return res.status(200).json(data);

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal server error', message: error.message });
    }
}
