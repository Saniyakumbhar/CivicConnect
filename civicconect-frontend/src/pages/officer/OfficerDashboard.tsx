import { Camera, CircleCheck, ClipboardList, FileText, MapPin, RefreshCw, Sparkles, Flag, Upload } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import FeatureGrid, { type Feature } from "../../components/dashboard/FeatureGrid";

const FEATURES: Feature[] = [
  { title: "Assigned Complaints", description: "Complaints routed to you.", icon: ClipboardList },
  { title: "Complaint Details", description: "Full report and history.", icon: FileText },
  { title: "Issue Image", description: "Photo submitted by the citizen.", icon: Camera },
  { title: "GPS Location", description: "Exact place of the issue.", icon: MapPin },
  { title: "AI Classification", description: "Automatic issue category.", icon: Sparkles },
  { title: "Priority", description: "Urgency level for each complaint.", icon: Flag },
  { title: "Update Complaint Status", description: "Move a complaint through each stage.", icon: RefreshCw },
  { title: "Upload Proof of Work", description: "Attach photos of the completed work.", icon: Upload },
  { title: "Mark as Resolved", description: "Close a complaint once fixed.", icon: CircleCheck },
];

export default function OfficerDashboard() {
  return (
    <DashboardLayout
      title="Welcome, {name}"
      subtitle="This is your Officer dashboard. Complaint handling will be added next."
    >
      <FeatureGrid features={FEATURES} />
    </DashboardLayout>
  );
}
