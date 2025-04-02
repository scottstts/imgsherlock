import os
from google import genai
from google.genai import types
import dotenv

def get_system_prompt():
    with open("prompts/img_detection.txt", "r") as f:
        prompt = f.read()
    return prompt

def generate(img_path):
    dotenv.load_dotenv()
    client = genai.Client(
        api_key=os.environ.get("GEMINI_API_KEY"),
    )

    files = [
        # Please ensure that the file is available in local system working direrctory or change the file path.
        client.files.upload(file=img_path),
    ]
    model = "gemini-2.5-pro-exp-03-25"
    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_uri(
                    file_uri=files[0].uri,
                    mime_type=files[0].mime_type,
                ),
                types.Part.from_text(text=get_system_prompt()),
            ],
        ),
    ]
    generate_content_config = types.GenerateContentConfig(
        response_mime_type="text/plain",
        temperature=0.3
    )

    response = client.models.generate_content(
        model=model,
        contents=contents,
        config=generate_content_config,)
    
    return response.text
