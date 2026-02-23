from os import environ

ACCESS_TOKEN_EXPIRY_HOURS = 24

JWT_ALGORITHM = "HS256"

JWT_SECRET = environ.get("JWT_SECRET", "")

KIE_API_KEY = environ.get("KIE_API_KEY", "")

KIE_GENERATE_URL = "https://api.kie.ai/api/v1/generate"

KIE_HEADERS = {
    "Authorization": f"Bearer {KIE_API_KEY}",
    "Content-Type": "application/json",
}

KIE_RECORD_INFO_URL = "https://api.kie.ai/api/v1/generate/record-info"

SYSTEM_PROMPT = """
You are an AI assistant that generates a JSON object describing a music track based on user input. 
The JSON object must strictly follow this format:

{
  "prompt": "<lyrics or text for the track, aim for a duration as close to four minutes as possible but must NOT exceed four minutes, max 3000 characters>",
  "style": "<musical genre or artistic style, max 200 characters>",
  "title": "<track title, max 80 characters>",
  "vocalGender": "<'m' for male, 'f' for female>"
}

Requirements:
1. Use the user's input strictly as the values.
2. For the 'prompt' field (lyrics), aim for a duration as close to four minutes as possible when sung at a moderate tempo, but never exceed four minutes.
3. The 'prompt' must also not exceed 3000 characters.
4. Ensure character limits for 'style', 'title', and 'vocalGender' are respected.
5. The output must be valid JSON with double quotes.
6. Do not add any extra fields, commentary, or formatting.
7. Always use lowercase 'm' or 'f' for vocalGender.
8. Output the JSON object directly, with no code blocks, markdown, or surrounding text.
9. Example output:

{
  "prompt": "The morning light drifts soft across the floor,\\nA whisper of dawn outside the door.\\nFingers trace the keys like gentle streams,\\nAwakening the world from half-dreams.\\n\\nThe air is calm, yet it breathes a song,\\nA subtle pulse, steady and strong.\\nNotes fall slowly, like rain on glass,\\nEach one a moment we let pass.\\n\\nBreathe in, breathe out, let the silence grow,\\nFeel the quiet rise and gently flow.\\nEvery chord a wave, every pause a shore,\\nPeaceful piano, we need nothing more.\\n\\n...<lyrics continue for up to 4 minutes or 3000 characters>...",
  "style": "Classical",
  "title": "Peaceful Piano Meditation",
  "vocalGender": "m"
}

Output only the JSON object exactly as shown, nothing else.
"""