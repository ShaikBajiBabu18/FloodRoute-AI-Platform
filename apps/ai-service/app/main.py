import os
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .schemas import ImageAnalysisResponse, TextClassificationRequest, TextClassificationResponse
from .vision_engine import OpenCVFloodAnalyzer, ExternalVisionAdapter

app = FastAPI(
    title="FloodRoute AI Computer Vision & Intelligence Service",
    description="Dedicated microservice for flood image segmentation, severity classification, and report verification",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

analyzer = OpenCVFloodAnalyzer()

@app.get("/")
def root():
    return {
        "service": "FloodRoute AI Vision Service",
        "status": "healthy",
        "engine": "OpenCV Multi-Band Segmenter",
        "disclaimer": "AI-assisted estimate. Not an official disaster determination."
    }

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "ai-service"}

@app.post("/analyze-image", response_model=ImageAnalysisResponse)
async def analyze_image(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image format (JPEG, PNG, WebP)")
    
    contents = await file.read()
    if len(contents) > 15 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image size exceeds 15MB limit")
    
    try:
        result = analyzer.analyze_image_bytes(contents)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Vision processing error: {str(e)}")

@app.post("/analyze-report", response_model=TextClassificationResponse)
def analyze_report(payload: TextClassificationRequest):
    text = (payload.text or "").lower()
    
    keywords_flood = ["flood", "flooded", "waterlogging", "submerged", "underwater", "inundated", "overflowing", "river", "culvert"]
    keywords_blocked = ["blocked", "closed", "impassable", "tree fallen", "landslide", "bridge", "stranded"]
    
    found_keywords = [kw for kw in (keywords_flood + keywords_blocked) if kw in text]
    
    score = min(1.0, len(found_keywords) * 0.25)
    
    if "impassable" in text or "completely submerged" in text or "stranded" in text:
        severity = "CRITICAL"
    elif "waist deep" in text or "closed" in text or "overflowing" in text:
        severity = "HIGH"
    elif "waterlogging" in text or "slow traffic" in text or "puddle" in text:
        severity = "MEDIUM"
    else:
        severity = "LOW"
        
    return TextClassificationResponse(
        floodRelevanceScore=round(score, 2),
        detectedKeywords=found_keywords,
        suggestedSeverity=severity,
        isActionable=len(found_keywords) > 0,
        explanation=f"Identified {len(found_keywords)} disaster-relevant terms: {', '.join(found_keywords) if found_keywords else 'None'}."
    )

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
