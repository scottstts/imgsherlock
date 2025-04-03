import re

def extract_json_content(text):
    """
    Check if the input text is wrapped with ```json ``` code block markers.
    If so, extract and return the content inside the markers.
    Otherwise, return the original text.
    
    Args:
        text (str): The input text to process
        
    Returns:
        str: The extracted content or original text
    """
    if not text:
        return text
        
    # Pattern to match ```json ... ``` with any content in between
    text = text.strip()
    pattern = r'```json\s*([\s\S]*?)\s*```'
    match = re.search(pattern, text)
    
    if match:
        # Return the content inside the markers
        return match.group(1).strip()
    
    return text 