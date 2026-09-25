import { LanguageLocale } from './types';

export interface I18nDictionary {
  appName: string;
  tagline: string;
  liveMap: string;
  routePlanner: string;
  weather: string;
  reportHazard: string;
  emergencySos: string;
  riverMonitoring: string;
  districtCommand: string;
  stateAnalytics: string;
  iotArchitecture: string;
  copilotTitle: string;
  copilotSubtitle: string;
  copilotPlaceholder: string;
  floodProbability: string;
  explainWhy: string;
  startDemo: string;
  speechListening: string;
  speechReadAlerts: string;
  call112: string;
  nearestHospital: string;
  nearestShelter: string;
  shareLocation: string;
  flashlight: string;
  highContrast: string;
  offlineMode: string;
  onlineMode: string;
  statusOnline: string;
  statusOffline: string;
  statusSyncing: string;
  disclaimerNote: string;
}

export const TRANSLATIONS: Record<LanguageLocale, I18nDictionary> = {
  en: {
    appName: 'FloodRoute AI',
    tagline: 'AI-Powered Flood-Aware Route Planning & Disaster Response Platform',
    liveMap: 'Live GIS Map',
    routePlanner: 'Route Planner',
    weather: 'Weather Intelligence',
    reportHazard: 'Report Hazard',
    emergencySos: 'Emergency SOS',
    riverMonitoring: 'River Telemetry',
    districtCommand: 'District Command',
    stateAnalytics: 'National Overview',
    iotArchitecture: 'IoT & Drones',
    copilotTitle: 'FloodRoute Copilot',
    copilotSubtitle: 'AI Emergency & Routing Assistant',
    copilotPlaceholder: 'Ask about flood risk, weather, routes...',
    floodProbability: 'Flood Probability',
    explainWhy: 'Explainable AI Breakdown',
    startDemo: 'Start AI Verse Demo',
    speechListening: 'Listening to Voice...',
    speechReadAlerts: 'Read Active Alerts',
    call112: 'Call 112 Emergency',
    nearestHospital: 'Nearest Hospital',
    nearestShelter: 'Nearest Safe Shelter',
    shareLocation: 'Share Live Location',
    flashlight: 'Emergency Flashlight',
    highContrast: 'High Contrast Mode',
    offlineMode: 'Offline Mode Active',
    onlineMode: 'Connected to Live Grid',
    statusOnline: 'ONLINE',
    statusOffline: 'OFFLINE',
    statusSyncing: 'SYNCING',
    disclaimerNote: 'AI FLOOD PREDICTION. Not an official statutory disaster determination.',
  },
  ta: {
    appName: 'ஃப்ளட்ரௌட் AI',
    tagline: 'வெள்ள அபாயமற்ற பயணப் பாதை & பேரிடர் மேலாண்மை தளம்',
    liveMap: 'நேரலை வரைபடம்',
    routePlanner: 'பயணத் திட்டம்',
    weather: 'வானிலை நுண்ணறிவு',
    reportHazard: 'வெள்ளப் பதிவு',
    emergencySos: 'அவசர உதவி (SOS)',
    riverMonitoring: 'ஆற்று நீர்மட்டம்',
    districtCommand: 'மாவட்ட கட்டளை',
    stateAnalytics: 'தேசிய பகுப்பாய்வு',
    iotArchitecture: 'IoT & ட்ரோன் கட்டமைப்பு',
    copilotTitle: 'ஃப்ளட்ரௌட் வழிகாட்டி',
    copilotSubtitle: 'AI அவசர மற்றும் பயண உதவியாளர்',
    copilotPlaceholder: 'வெள்ள அபாயம், வானிலை பற்றி கேளுங்கள்...',
    floodProbability: 'வெள்ள சாத்தியக்கூறு',
    explainWhy: 'AI விளக்கக் காரணங்கள்',
    startDemo: 'மாதிரி காட்சியைத் தொடங்கு',
    speechListening: 'குரலைக் கேட்கிறது...',
    speechReadAlerts: 'எச்சரிக்கைகளை வாசி',
    call112: '112 அவசர அழைப்பு',
    nearestHospital: 'அருகிலுள்ள மருத்துவமனை',
    nearestShelter: 'அருகிலுள்ள தங்குமிடம்',
    shareLocation: 'இருப்பிடத்தைப் பகிர்',
    flashlight: 'அவசர டார்ச் விளக்கு',
    highContrast: 'உயர் மாறுபட்ட பயன்முறை',
    offlineMode: 'இணையமற்ற பயன்முறை',
    onlineMode: 'இணையத்துடன் இணைக்கப்பட்டது',
    statusOnline: 'இணைப்பில்',
    statusOffline: 'இணைப்பில்லை',
    statusSyncing: 'ஒத்திசைக்கிறது',
    disclaimerNote: 'AI வெள்ள முன்கணிப்பு. அதிகாரப்பூர்வ அரசு அறிவிப்பு அல்ல.',
  },
  te: {
    appName: 'ఫ్లడ్‌రూట్ AI',
    tagline: 'వరద రహిత రూట్ ప్లానింగ్ & విపత్తు ప్రతిస్పందన ప్లాట్‌ఫారమ్',
    liveMap: 'ప్రత్యక్ష పటం',
    routePlanner: 'రూట్ ప్లానర్',
    weather: 'వాతావరణ నిఘా',
    reportHazard: 'వరద రిపోర్ట్',
    emergencySos: 'అత్యవసర SOS',
    riverMonitoring: 'నదీ జలాల పర్యవేక్షణ',
    districtCommand: 'జిల్లా కమాండ్',
    stateAnalytics: 'జాతీయ అవలోకనం',
    iotArchitecture: 'IoT & డ్రోన్లు',
    copilotTitle: 'ఫ్లడ్‌రూట్ కోపైలట్',
    copilotSubtitle: 'AI అత్యవసర & ప్రయాణ సహాయకుడు',
    copilotPlaceholder: 'వరద ప్రమాదం, వాతావరణం గురించి అడగండి...',
    floodProbability: 'వరద సంభావ్యత',
    explainWhy: 'AI విశ్లేషణ కారణాలు',
    startDemo: 'డెమో ప్రారంభించండి',
    speechListening: 'వాయిస్ వింటోంది...',
    speechReadAlerts: 'హెచ్చరికలు చదవండి',
    call112: '112 అత్యవసర కాల్',
    nearestHospital: 'సమీప ఆసుపత్రి',
    nearestShelter: 'సమీప ఆశ్రయం',
    shareLocation: 'ప్రత్యక్ష స్థానాన్ని భాగస్వామ్యం చేయండి',
    flashlight: 'అత్యవసర ఫ్లాష్‌లైట్',
    highContrast: 'అధిక కాంట్రాస్ట్ మోడ్',
    offlineMode: 'ఆఫ్‌లైన్ మోడ్ సక్రియం',
    onlineMode: 'ఆన్‌లైన్‌లో కనెక్ట్ అయింది',
    statusOnline: 'ఆన్‌లైన్',
    statusOffline: 'ఆఫ్‌లైన్',
    statusSyncing: 'సింక్ అవుతోంది',
    disclaimerNote: 'AI వరద అంచనా. అధికారిక ప్రభుత్వ నిర్ణయం కాదు.',
  },
  hi: {
    appName: 'फ्लडरूट AI',
    tagline: 'AI-संचालित बाढ़-मुक्त मार्ग योजना और आपदा प्रबंधन प्लेटफॉर्म',
    liveMap: 'लाइव जीआईएस मैप',
    routePlanner: 'रूट प्लानर',
    weather: 'मौसम इंटेलिजेंस',
    reportHazard: 'खतरे की रिपोर्ट',
    emergencySos: 'आपातकालीन एसओएस',
    riverMonitoring: 'नदी जलस्तर मॉनिटरिंग',
    districtCommand: 'जिला कमान केंद्र',
    stateAnalytics: 'राष्ट्रीय विश्लेषण',
    iotArchitecture: 'IoT और ड्रोन वास्तुकला',
    copilotTitle: 'फ्लडरूट कोपायलट',
    copilotSubtitle: 'AI आपातकालीन और नेविगेशन सहायक',
    copilotPlaceholder: 'बाढ़ जोखिम, मौसम या रूट के बारे में पूछें...',
    floodProbability: 'बाढ़ की संभावना',
    explainWhy: 'AI व्याख्या और विश्लेषण',
    startDemo: 'AI डेमो शुरू करें',
    speechListening: 'आवाज सुन रहा है...',
    speechReadAlerts: 'अलर्ट पढ़कर सुनाएं',
    call112: '112 आपातकालीन कॉल',
    nearestHospital: 'निकटतम अस्पताल',
    nearestShelter: 'निकटतम सुरक्षित आश्रय',
    shareLocation: 'लाइव स्थान साझा करें',
    flashlight: 'आपातकालीन टॉर्च',
    highContrast: 'उच्च कंट्रास्ट मोड',
    offlineMode: 'ऑफलाइन मोड सक्रिय',
    onlineMode: 'लाइव ग्रिड से जुड़ा',
    statusOnline: 'ऑनलाइन',
    statusOffline: 'ऑफलाइन',
    statusSyncing: 'सिंकिंग',
    disclaimerNote: 'AI बाढ़ भविष्यवाणी। आधिकारिक सरकारी वैधानिक निर्धारण नहीं।',
  },
  kn: {
    appName: 'ಫ್ಲಡ್‌ರೂಟ್ AI',
    tagline: 'ಪ್ರವಾಹ-ಮುಕ್ತ ಮಾರ್ಗ ಯೋಜನೆ ಮತ್ತು ವಿಪತ್ತು ನಿರ್ವಹಣಾ ವೇದಿಕೆ',
    liveMap: 'ನೇರ ನಕ್ಷೆ',
    routePlanner: 'ಮಾರ್ಗ ಯೋಜಕ',
    weather: 'ಹವಾಮಾನ ಬುದ್ಧಿಮತ್ತೆ',
    reportHazard: 'ಪ್ರವಾಹ ವರದಿ ಮಾಡಿ',
    emergencySos: 'ತುರ್ತು SOS',
    riverMonitoring: 'ನದಿ ನೀರಿನ ಮಟ್ಟ',
    districtCommand: 'ಜಿಲ್ಲಾ ಕಮಾಂಡ್',
    stateAnalytics: 'ರಾಷ್ಟ್ರೀಯ ಅವಲೋಕನ',
    iotArchitecture: 'IoT & ಡ್ರೋನ್ ತಂತ್ರಜ್ಞಾನ',
    copilotTitle: 'ಫ್ಲಡ್‌ರೂಟ್ ಕೋಪೈಲಟ್',
    copilotSubtitle: 'AI ತುರ್ತು & ಮಾರ್ಗ ಸಹಾಯಕಿ',
    copilotPlaceholder: 'ಪ್ರವಾಹ ಅಪಾಯ, ಹವಾಮಾನ ಕುರಿತು ಕೇಳಿ...',
    floodProbability: 'ಪ್ರವಾಹ ಸಂಭವನೀಯತೆ',
    explainWhy: 'AI ವಿವರಣೆ ಕಾರಣಗಳು',
    startDemo: 'ಡೆಮೊ ಪ್ರಾರಂಭಿಸಿ',
    speechListening: 'ಧ್ವನಿ ಆಲಿಸುತ್ತಿದೆ...',
    speechReadAlerts: 'ಎಚ್ಚರಿಕೆಗಳನ್ನು ಓದಿ',
    call112: '112 ತುರ್ತು ಕರೆ',
    nearestHospital: 'ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆ',
    nearestShelter: 'ಹತ್ತಿರದ ಸುರಕ್ಷಿತ ಆಶ್ರಯ',
    shareLocation: 'ಲೈವ್ ಸ್ಥಳ ಹಂಚಿಕೊಳ್ಳಿ',
    flashlight: 'ತುರ್ತು ಫ್ಲ್ಯಾಷ್‌ಲೈಟ್',
    highContrast: 'ಹೆಚ್ಚಿನ ಕಾಂಟ್ರಾಸ್ಟ್ ಮೋಡ್',
    offlineMode: 'ಆಫ್‌ಲೈನ್ ಮೋಡ್ ಸಕ್ರಿಯ',
    onlineMode: 'ಆನ್‌ಲೈನ್‌ನಲ್ಲಿದೆ',
    statusOnline: 'ಆನ್‌ಲೈನ್',
    statusOffline: 'ಆಫ್‌ಲೈನ್',
    statusSyncing: 'ಸಿಂಕ್ ಆಗುತ್ತಿದೆ',
    disclaimerNote: 'AI ಪ್ರವಾಹ ಭವಿಷ್ಯವಾಣಿ. ಅಧಿಕೃತ ಸರ್ಕಾರಿ ನಿರ್ಣಯವಲ್ಲ.',
  },
};
