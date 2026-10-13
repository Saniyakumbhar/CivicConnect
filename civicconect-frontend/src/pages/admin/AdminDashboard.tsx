import { Activity, Bell, Building2, FileText, Landmark, Settings, ShieldCheck, Store, Users } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import FeatureGrid, { type Feature } from "../../components/dashboard/FeatureGrid";

const FEATURES: Feature[] = [
  { title: "Manage Citizens", description: "View and manage citizen accounts.", icon: Users },
  { title: "Manage Officers", description: "Create, approve and assign officers.", icon: ShieldCheck },
  { title: "Manage Departments", description: "Set up civic departments.", icon: Building2 },
  { title: "Verify Businesses", description: "Review local business listings.", icon: Store },
  { title: "Manage Government Schemes", description: "Add and update scheme information.", icon: Landmark },
  { title: "Manage Complaints", description: "Oversee all complaints.", icon: FileText },
  { title: "Analytics", description: "Trends and resolution statistics.", icon: Activity },
  { title: "Notifications", description: "Platform-wide announcements.", icon: Bell },
  { title: "System Settings", description: "Configure the platform.", icon: Settings },
];

export default function AdminDashboard() {
  return (
    <DashboardLayout
      title="Welcome, {name}"
      subtitle="This is your Admin dashboard. Management modules will be added next."
    >
      <p>
        <Link to="/admin/officers" className="btn btn--primary">
          <ShieldCheck size={18} aria-hidden="true" />
          Manage Officers
        </Link>
      </p>
      <FeatureGrid features={FEATURES} />
    </DashboardLayout>
  );
}
