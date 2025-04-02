from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
import json
import tempfile
from pydantic import BaseModel
import shutil
import asyncio
from functools import partial
import concurrent.futures

# Import the generate function from get_result.py
from get_result import generate
from utils import extract_json_content

# Create a ThreadPoolExecutor for I/O bound operations
thread_pool = concurrent.futures.ThreadPoolExecutor(max_workers=10)

app = FastAPI(title="ImgSherlock API", description="API for detecting AI-generated images")

# Add CORS middleware to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend dev server address
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Use a dynamic model that can accept any JSON structure
class DetectionResult(BaseModel):
    isAiGenerated: bool
    confidence: float
    details: str

@app.get("/")
async def read_root():
    return {"message": "ImgSherlock API is running"}

async def run_in_threadpool(func, *args, **kwargs):
    """Run a non-async function in a threadpool to prevent blocking."""
    loop = asyncio.get_running_loop()
    return await loop.run_in_executor(
        thread_pool, partial(func, *args, **kwargs)
    )

@app.post("/api/detect")
async def detect_image(image: UploadFile = File(...)):
    """
    Process an uploaded image and return detection results
    """
    # Validate file type
    valid_mime_types = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if image.content_type not in valid_mime_types:
        raise HTTPException(
            status_code=400, 
            detail="Invalid file type. Please upload a JPG, PNG, GIF, or WebP image."
        )
    
    # Create a temporary file to store the uploaded image
    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(image.filename)[1]) as temp_file:
        # Copy the uploaded image to the temporary file
        await run_in_threadpool(shutil.copyfileobj, image.file, temp_file)
        temp_file_path = temp_file.name
    
    try:
        # Process the image with the generate function in a threadpool
        result_text = await run_in_threadpool(generate, temp_file_path)
        
        # Extract JSON content if wrapped in code blocks
        clean_text = extract_json_content(result_text)
        
        # Try to parse as JSON
        try:
            # Parse the JSON text
            result_data = json.loads(clean_text)
            
            # Pass the result directly to the frontend
            return result_data
            
        except json.JSONDecodeError:
            # If parsing fails, return the error with the original text
            raise HTTPException(
                status_code=500,
                detail=f"Failed to parse JSON from LLM response. Original response: {result_text[:200]}..."
            )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")
    
    finally:
        # Clean up the temporary file in a non-blocking way
        if os.path.exists(temp_file_path):
            await run_in_threadpool(os.unlink, temp_file_path)

if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True, workers=4) 