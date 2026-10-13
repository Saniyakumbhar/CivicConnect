import {
  Activity,
  Bell,
  ClipboardList,
  FileWarning,
  MapPin,
  Search,
  Sparkles,
  Store,
  UserRound,
} from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import FeatureGrid, { type Feature } from "../../components/dashboard/FeatureGrid";

const FEATURES: Feature[] = [
  { title: "Report Civic Issue", description: "Submit a complaint with photo and location.", icon: FileWarning },
  { title: "My Complaints", description: "See everything you have reported.", icon: ClipboardList },
  { title: "Complaint Status Tracking", description: "Follow progress from filed to resolved.", icon: Activity },
  { title: "Nearby Civic Issues", description: "View issues reported around you.", icon: MapPin },
  { title: "Local Business Discovery", description: "Find verified businesses nearby.", icon: Store },
  { title: "Government Scheme Search", description: "Search schemes by need or category.", icon: Search },
  { title: "Recommended Government Schemes", description: "Schemes matched to your profile.", icon: Sparkles },
  { title: "Notifications", description: "Updates on your complaints and schemes.", icon: Bell },
  { title: "Profile", description: "Manage your personal details.", icon: UserRound },
];

export default function CitizenDashboard() {
  return (
    <DashboardLayout
      title="Welcome, {name}"
      subtitle="This is your Citizen dashboard. These modules will be added next."
    >
      <FeatureGrid features={FEATURES} />
    </DashboardLayout>
  );
}
