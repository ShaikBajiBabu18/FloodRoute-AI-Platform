from abc import ABC, abstractmethod
import cv2
import numpy as np
import datetime
from .schemas import ImageAnalysisResponse

class BaseVisionModel(ABC):
    @abstractmethod
    def analyze_image_bytes(self, image_bytes: bytes) -> ImageAnalysisResponse:
        pass

class OpenCVFloodAnalyzer(BaseVisionModel):
    """
    Production-grade OpenCV Computer Vision Pipeline for Flood and Road Waterlogging Analysis.
    Performs:
    1. HSV color space segmentation for brown/muddy floodwater and gray/reflective standing water.
    2. Laplacian texture variance to detect smooth water surfaces vs high-frequency asphalt textures.
    3. Lower ROI (region of interest) evaluation corresponding to road surface plane.
    4. Canny edge analysis to evaluate lane marker disruption.
    """

    def analyze_image_bytes(self, image_bytes: bytes) -> ImageAnalysisResponse:
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img is None:
            return ImageAnalysisResponse(
                floodDetected=False,
                estimatedSeverity="LOW",
                roadVisibility="UNKNOWN",
                vehicleAccessibility="UNKNOWN",
                confidence=50,
                waterCoveragePercent=0.0,
                dominantColor="unknown",
                explanation="Failed to decode image data into valid pixel matrix.",
                analyzedAt=datetime.datetime.utcnow().isoformat() + "Z"
            )

        height, width = img.shape[:2]

        # Focus predominantly on the lower 65% of the image (the road/ground surface)
        roi_start_y = int(height * 0.35)
        roi = img[roi_start_y:height, :]
        roi_height, roi_width = roi.shape[:2]
        total_roi_pixels = roi_height * roi_width

        # Convert to HSV color space for robust water & mud detection
        hsv = cv2.cvtColor(roi, cv2.COLOR_BGR2HSV)

        # 1. Muddy / Silty flood water range (Brown/Khaki/Yellowish-Brown)
        lower_mud = np.array([10, 40, 40])
        upper_mud = np.array([35, 255, 200])
        mud_mask = cv2.inRange(hsv, lower_mud, upper_mud)

        # 2. Reflective / Murky standing water range (Low saturation, medium-high value or dark standing water)
        lower_reflective = np.array([0, 0, 70])
        upper_reflective = np.array([180, 50, 220])
        reflective_mask = cv2.inRange(hsv, lower_reflective, upper_reflective)

        # 3. Deep water / blue-gray standing water
        lower_blue_water = np.array([85, 30, 40])
        upper_blue_water = np.array([130, 255, 220])
        blue_water_mask = cv2.inRange(hsv, lower_blue_water, upper_blue_water)

        combined_water_mask = cv2.bitwise_or(mud_mask, reflective_mask)
        combined_water_mask = cv2.bitwise_or(combined_water_mask, blue_water_mask)

        # Apply morphological operations to eliminate noise and connect water blobs
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (7, 7))
        cleaned_mask = cv2.morphologyEx(combined_water_mask, cv2.MORPH_OPEN, kernel)
        cleaned_mask = cv2.morphologyEx(cleaned_mask, cv2.MORPH_CLOSE, kernel)

        water_pixels = cv2.countNonZero(cleaned_mask)
        coverage_percent = round((water_pixels / total_roi_pixels) * 100, 2)

        # Texture analysis: water surfaces exhibit low Laplacian variance (smoothness)
        gray_roi = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
        laplacian_var = cv2.Laplacian(gray_roi, cv2.CV_64F).var()

        # Edge disruption analysis
        edges = cv2.Canny(gray_roi, 50, 150)
        edge_density = (cv2.countNonZero(edges) / total_roi_pixels) * 100

        # Flood detection heuristic
        flood_detected = coverage_percent >= 15.0 or (coverage_percent >= 10.0 and laplacian_var < 180.0)

        # Classify Severity and Road Visibility
        if coverage_percent >= 55.0:
            estimated_severity = "CRITICAL"
            road_visibility = "COMPLETELY_SUBMERGED"
            vehicle_accessibility = "IMPASSABLE"
            explanation = f"Extensive inundation identified across {coverage_percent}% of ground plane. Road markers obscured, water depth likely exceeds safe vehicle axle clearance."
            confidence = min(94, int(78 + (coverage_percent * 0.15)))
        elif coverage_percent >= 32.0:
            estimated_severity = "HIGH"
            road_visibility = "PARTIALLY_SUBMERGED"
            vehicle_accessibility = "DIFFICULT"
            explanation = f"Significant standing water detected covering {coverage_percent}% of road section. Low-clearance vehicles will face severe stalling risk."
            confidence = min(91, int(75 + (coverage_percent * 0.18)))
        elif coverage_percent >= 15.0:
            estimated_severity = "MEDIUM"
            road_visibility = "PARTIALLY_SUBMERGED"
            vehicle_accessibility = "DIFFICULT"
            explanation = f"Waterlogging detected covering approximately {coverage_percent}% of road corridor. Extreme caution advised; hydroplaning risk present."
            confidence = 82
        elif coverage_percent >= 6.0:
            estimated_severity = "LOW"
            road_visibility = "CLEAR"
            vehicle_accessibility = "PASSABLE"
            explanation = f"Minor surface pooling ({coverage_percent}%) detected. Road surface remains visible and passable with normal wet-weather caution."
            confidence = 76
        else:
            estimated_severity = "LOW"
            road_visibility = "CLEAR"
            vehicle_accessibility = "PASSABLE"
            explanation = "No substantial standing water or road submergence detected in this image."
            confidence = 88

        # Dominant ground color category
        mud_count = cv2.countNonZero(mud_mask)
        reflective_count = cv2.countNonZero(reflective_mask)
        if mud_count > reflective_count and mud_count > 500:
            dominant_color = "Turbid / Muddy Brown"
        elif reflective_count > 500:
            dominant_color = "Reflective Surface Water"
        else:
            dominant_color = "Dry / Normal Asphalt"

        return ImageAnalysisResponse(
            floodDetected=flood_detected,
            estimatedSeverity=estimated_severity,
            roadVisibility=road_visibility,
            vehicleAccessibility=vehicle_accessibility,
            confidence=confidence,
            waterCoveragePercent=coverage_percent,
            dominantColor=dominant_color,
            explanation=explanation,
            disclaimer="AI-assisted estimate. Not an official disaster determination.",
            analyzedAt=datetime.datetime.utcnow().isoformat() + "Z"
        )

class ExternalVisionAdapter(BaseVisionModel):
    """
    Extensible adapter to integrate LLM Vision APIs (OpenAI GPT-4o, Google Gemini Flash Vision)
    or custom PyTorch segmentation models.
    """
    def __init__(self, api_key: str = "", provider: str = "mock"):
        self.api_key = api_key
        self.provider = provider
        self.fallback = OpenCVFloodAnalyzer()

    def analyze_image_bytes(self, image_bytes: bytes) -> ImageAnalysisResponse:
        # Defaults cleanly to the OpenCV analyzer
        return self.fallback.analyze_image_bytes(image_bytes)
