export type PowerStatus = 'NORMAL' | 'MAINTENANCE' | 'OUTAGE_FAULT' | 'RESTORED' | 'STORM_RISK';

export type ConnectivityMode = 'online' | 'low-bandwidth' | 'offline';

export interface TimelineBlock {
  id: string;
  startTime: string; // e.g. "08:00"
  endTime: string;   // e.g. "14:00"
  status: PowerStatus;
  label: string;      // e.g. "Normal Power", "Planned Substation Maintenance", "Fault Forecasted"
  subtext: string;    // e.g. "110kV Kurinjipadi Feeder overhaul"
  probability: number; // 0-100%
  feederLine?: string;
  affectedTransformers?: number;
  expectedRestoration?: string;
  weatherCondition?: string;
  iconType: 'sun' | 'warning' | 'outage' | 'restore' | 'storm' | 'lightning';
}

export interface DayForecast {
  date: string;       // "2026-08-26"
  dayLabel: string;   // "TODAY, AUG 26"
  shortDay: string;   // "Today"
  status: PowerStatus;
  uptimeHours: number;
  outageRiskScore: number; // 0-100
  weatherTemp: number;     // e.g. 33
  weatherCondition: string;// "Sunny & Humid", "Monsoon Thunderstorm"
  weatherIcon: string;
  summary: string;
  blocks: TimelineBlock[];
  scheduledCut?: {
    from: string;
    to: string;
    substation: string;
    purpose: string;
    officialNoticeNo: string;
  };
}

export interface Region {
  id: string;
  name: string;
  district: string;
  state: string;
  substation: string;
  feederCode: string;
  gridUptimeMonthly: number; // e.g. 96.4%
  deadZoneRiskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  cellTowerBackupHours: number; // e.g. 1.5 hours
  historicalPattern: {
    rule: string; // "3rd Thursday of every month"
    confidence: number; // e.g. 94%
    lastMaintenanceDate: string;
    nextPredictedDate: string;
    seasonTrend: string; // "High storm trips during Oct-Dec Northeast Monsoon"
  };
  forecasts: DayForecast[];
  emergencyContacts: {
    tnebFuseCall: string;
    substationAE: string;
    nearestHospital: string;
    policeControl: string;
  };
}

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  icon: 'phone' | 'book' | 'battery' | 'power' | 'water' | 'fridge' | 'laptop' | 'medical';
  emoji?: string;
  countdown?: string;
  completed: boolean;
  category: 'essential' | 'productivity' | 'comfort';
  timeframe?: string;
}

export interface PowerHub {
  id: string;
  name: string;
  category: 'library' | 'coworking' | 'cafe' | 'community';
  address: string;
  distanceKm: number;
  verifiedBackup: 'Diesel Generator' | 'Heavy Solar + UPS' | 'Dual Feeder Grid';
  socketsAvailable: number;
  wifiSpeedMbps: number;
  openHours: string;
  isOpenNow: boolean;
  acAvailable: boolean;
  feeType: 'Free' | 'Paid / Buy Coffee' | 'Membership';
  coords: { x: number; y: number }; // Relative coordinates for interactive map
}

export interface OfflineActivity {
  id: string;
  title: string;
  durationMinutes: 30 | 120 | 240;
  category: 'mind' | 'physical' | 'creative' | 'culinary' | 'social';
  description: string;
  steps: string[];
  batteryDrainImpact: 'Zero Battery' | 'Low Battery' | 'No Device Needed';
}

export interface InverterDevice {
  id: string;
  name: string;
  watts: number;
  count: number;
  category: 'fans' | 'lights' | 'electronics' | 'appliances';
  essential: boolean;
}

export interface CrowdReport {
  id: string;
  regionId: string;
  timestamp: string;
  streetName: string;
  outageType: 'Complete Blackout' | 'Single Phase / Low Voltage' | 'Transformer Spark' | 'Tree Fall on Cable';
  verifiedCount: number;
  userVerified: boolean;
  status: 'Investigating' | 'Linemen Dispatched' | 'Work In Progress' | 'Restored';
  comments: string;
}

export interface UtilityAlert {
  id: string;
  type: 'CRITICAL' | 'WARNING' | 'INFO' | 'SUCCESS';
  title: string;
  message: string;
  timestamp: string;
  affectedAreas: string[];
}

export type ThemeMode = 'dark' | 'light' | 'amoled' | 'auto';

export interface BatteryState {
  isSupported: boolean;
  level: number; // 0 to 1 (e.g. 0.85 = 85%)
  percentage: number; // 0 to 100
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  isBatterySaver: boolean;
  isSimulated: boolean;
}

export interface NotificationSettings {
  gridRestoration: boolean;
  outageAlerts: boolean;
  autoBatterySaver?: boolean;
}
