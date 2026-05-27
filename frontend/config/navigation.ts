import {
  LayoutDashboard, Users, Stethoscope, CalendarDays, PhoneCall,
  Wallet, Pill, BarChart3, UserCircle, Calendar, UserRound,
  BriefcaseMedical, ReceiptIndianRupee, FlaskConical, Percent,
  Bell, Settings, LifeBuoy, BrainCircuit, Building2, HardHat,
  BadgeDollarSign, PackageSearch, TestTube2, Cpu, Code2,
  Presentation, LineChart, Activity, UserPlus, Search,
  CalendarPlus, CheckSquare, FileText, ClipboardList, Package,
  RotateCcw, LucideIcon
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export type NavGroup = {
  title: string;
  items: NavItem[];
};

export type NavigationConfig = {
  directItems: NavItem[];
  groups: NavGroup[];
};

export const roleNavigation: Record<string, NavigationConfig> = {
  doctor: {
    directItems: [
      { title: 'Dashboard', href: ROUTES.doctor.dashboard, icon: LayoutDashboard },
      { title: 'Reports', href: ROUTES.doctor.reports, icon: BarChart3 },
    ],
    groups: [
      {
        title: 'Clinical',
        items: [
          { title: 'OPD Queue', href: ROUTES.doctor.queue, icon: Users },
          { title: 'Consultation', href: ROUTES.doctor.consultation, icon: Stethoscope },
          { title: 'F/U Call List', href: ROUTES.doctor.followupCallList, icon: PhoneCall },
        ]
      },
      {
        title: 'Management',
        items: [
          { title: 'Appointments', href: ROUTES.doctor.appointments, icon: CalendarDays },
          { title: 'Billing View', href: ROUTES.doctor.billingView, icon: Wallet },
          { title: 'Pharmacy View', href: ROUTES.doctor.pharmacy, icon: Pill },
        ]
      }
    ]
  },
  admin: {
    directItems: [
      { title: 'Dashboard', href: ROUTES.ADMIN_DASHBOARD, icon: LayoutDashboard },
    ],
    groups: [
      {
        title: 'Core Modules',
        items: [
          { title: 'Patient Mgmt', href: ROUTES.ADMIN_PATIENTS, icon: Users },
          { title: 'Doctor Mgmt', href: ROUTES.ADMIN_DOCTORS, icon: UserRound },
          { title: 'Staff Mgmt', href: ROUTES.ADMIN_STAFF, icon: BriefcaseMedical },
          { title: 'Appointments', href: ROUTES.ADMIN_APPOINTMENTS, icon: Calendar },
        ]
      },
      {
        title: 'Masters',
        items: [
          { title: 'Billing', href: ROUTES.ADMIN_BILLING, icon: ReceiptIndianRupee },
          { title: 'Drug Master', href: ROUTES.ADMIN_DRUGS, icon: Pill },
          { title: 'Lab Master', href: ROUTES.admin.lab, icon: FlaskConical },
          { title: 'Procedure Master', href: ROUTES.admin.procedures, icon: Stethoscope },
          { title: 'Discounts', href: ROUTES.ADMIN_DISCOUNTS, icon: Percent },
        ]
      },
      {
        title: 'Enterprise ERP',
        items: [
          { title: 'ERP Intelligence', href: ROUTES.GLOBAL.ERP_INTELLIGENCE, icon: BrainCircuit },
          { title: 'HRMS', href: ROUTES.GLOBAL.HRMS, icon: Building2 },
          { title: 'Workforce', href: ROUTES.GLOBAL.WORKFORCE, icon: HardHat },
          { title: 'Payroll', href: ROUTES.GLOBAL.PAYROLL, icon: BadgeDollarSign },
          { title: 'Procurement', href: ROUTES.GLOBAL.PROCUREMENT, icon: PackageSearch },
        ]
      },
      {
        title: 'Intelligence & AI',
        items: [
          { title: 'Pharmacy AI', href: ROUTES.GLOBAL.PHARMACY_INTELLIGENCE, icon: TestTube2 },
          { title: 'Biomedical Ops', href: ROUTES.GLOBAL.BIOMEDICAL, icon: Cpu },
          { title: 'Facility Ops', href: ROUTES.GLOBAL.FACILITY_OPS, icon: Building2 },
          { title: 'Exec Command', href: ROUTES.GLOBAL.EXECUTIVE, icon: Presentation },
          { title: 'Analytics Studio', href: ROUTES.GLOBAL.ANALYTICS_STUDIO, icon: LineChart },
          { title: 'BI Observability', href: ROUTES.GLOBAL.OBSERVABILITY_ANALYTICS, icon: Activity },
        ]
      },
      {
        title: 'System',
        items: [
          { title: 'Notifications', href: ROUTES.ADMIN_NOTIFICATIONS, icon: Bell },
          { title: 'Reports', href: ROUTES.admin.reports, icon: BarChart3 },
          { title: 'Financial Reports', href: ROUTES.GLOBAL.FINANCIAL_REPORTS, icon: ReceiptIndianRupee },
          { title: 'Security Center', href: ROUTES.admin.securityCommandCenter, icon: Activity },
          { title: 'Settings', href: ROUTES.admin.settings, icon: Settings },
          { title: 'Support', href: ROUTES.ADMIN_SUPPORT, icon: LifeBuoy },
          { title: 'Developer Portal', href: ROUTES.GLOBAL.DEVELOPER, icon: Code2 },
        ]
      }
    ]
  },
  reception: {
    directItems: [
      { title: 'Dashboard', href: ROUTES.reception.dashboard, icon: LayoutDashboard },
      { title: 'Register Patient', href: ROUTES.reception.register, icon: UserPlus },
      { title: 'Search Patient', href: ROUTES.reception.search, icon: Search },
      { title: 'Check-In', href: ROUTES.reception.checkin, icon: CheckSquare },
      { title: 'OPD Queue', href: ROUTES.reception.queue, icon: Users },
      { title: 'Book Appointment', href: ROUTES.reception.appointments, icon: CalendarPlus },
      { title: 'Billing', href: ROUTES.reception.billing, icon: Wallet },
    ],
    groups: []
  },
  nursing: {
    directItems: [
      { title: 'Dashboard', href: ROUTES.nursing.dashboard, icon: LayoutDashboard },
    ],
    groups: [
      {
        title: 'Clinical Tasks',
        items: [
          { title: 'OPD Queue', href: ROUTES.nursing.queue, icon: Users },
          { title: 'Vitals Entry', href: ROUTES.nursing.vitals, icon: Activity },
          { title: 'Lab Reports', href: ROUTES.nursing.labReports, icon: FileText },
          { title: 'F/U Call Mgmt', href: ROUTES.nursing.followup, icon: PhoneCall },
        ]
      }
    ]
  },
  medical: {
    directItems: [
      { title: 'Dashboard', href: ROUTES.medical.dashboard, icon: LayoutDashboard },
      { title: 'Alerts', href: ROUTES.medical.alerts, icon: Bell },
    ],
    groups: [
      {
        title: 'Operations',
        items: [
          { title: 'Dispensing Queue', href: ROUTES.medical.dispensing, icon: ClipboardList },
          { title: 'Stock Management', href: ROUTES.medical.stock, icon: Package },
          { title: 'Drug Returns', href: ROUTES.medical.returns, icon: RotateCcw },
        ]
      }
    ]
  },
};
