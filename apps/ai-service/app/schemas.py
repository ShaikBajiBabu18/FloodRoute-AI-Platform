from pydantic import BaseModel, Field
from typing import Optional, List

class ImageAnalysisResponse(BaseModel):
    floodDetected: bool
    estimatedSeverity: str = Field(..., description="LOW | MEDIUM | HIGH | CRITICAL")
    roadVisibility: str = Field(..., description="CLEAR | PARTIALLY_SUBMERGED | COMPLETELY_SUBMERGED | UNKNOWN")
    vehicleAccessibility: str = Field(..., description="PASSABLE | DIFFICULT | IMPASSABLE | UNKNOWN")
    confidence: int = Field(..., ge=0, le=100)
    waterCoveragePercent: float
    dominantColor: Optional[str] = None
    explanation: str
    disclaimer: str = "AI-assisted estimate. Not an official disaster determination."
    analyzedAt: str

class TextClassificationRequest(BaseModel):
    text: str
    hazardType: Optional[str] = None
    location: Optional[str] = None

class TextClassificationResponse(BaseModel):
    floodRelevanceScore: float
    detectedKeywords: List[str]
    suggestedSeverity: str
    isActionable: bool
    explanation: str
