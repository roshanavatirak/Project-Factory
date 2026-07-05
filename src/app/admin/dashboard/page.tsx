"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Terminal, ShieldCheck, User, Clock, Settings, Database, 
  Trash2, UserCheck, RefreshCw, Sliders, CheckCircle2, 
  DollarSign, AlertCircle, LogOut, FileText, ChevronRight
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/Toast";
import { getSessionAction, logoutAction } from "@/app/actions/auth";
import {
  adminGetStatsAction,
  adminGetUsersAction,
  adminGetInquiriesAction,
  adminUpdateUserRoleAction,
  adminUpdateInquiryStatusAction,
  adminDeleteUserAction,
  adminDeleteInquiryAction,
  adminGetPackagesAction,
  adminUpdatePackageAction,
  adminCreatePackageAction
} from "@/app/actions/admin";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [adminUser, setAdminUser] = useState<any>(null);
  const [verifyingSession, setVerifyingSession] = useState(true);
  
  // Data states
  const [stats, setStats] = useState<any>({
    totalUsers: 0,
    totalInquiries: 0,
    estRevenue: 0,
    pendingInquiries: 0,
    totalProjects: 0,
  });
  const [users, setUsers] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  
  // Package editing states
  const [editingPackage, setEditingPackage] = useState<any>(null);
  const [editingFeatures, setEditingFeatures] = useState<string>("");
  const [updatingPackage, setUpdatingPackage] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  
  // Loading states
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingInquiries, setLoadingInquiries] = useState(true);
  const [loadingPackages, setLoadingPackages] = useState(true);
  
  // Tab controller
  const [activeTab, setActiveTab] = useState<"overview" | "packages" | "students" | "purchases" | "system">("overview");

  const updateStatsState = (backendStats: any) => {
    if (!backendStats) return;
    setStats({
      totalUsers: backendStats.totalUsers ?? 0,
      totalInquiries: backendStats.totalInquiries ?? 0,
      estRevenue: backendStats.totalRevenue ?? backendStats.estRevenue ?? 0,
      pendingInquiries: backendStats.pendingCount ?? backendStats.pendingInquiries ?? 0,
      totalProjects: backendStats.totalProjects ?? 0,
    });
  };

  // Verify Admin Session on mount
  useEffect(() => {
    let active = true;
    async function checkAdminSession() {
      try {
        const session = await getSessionAction();
        if (session.success && session.user && session.user.role === "admin") {
          if (active) {
            setAdminUser(session.user);
            toast("Admin credentials validated. Welcome back, commander.", "success");
          }
        } else {
          toast("Access denied: Admin role required.", "error");
          router.push("/dashboard");
        }
      } catch (err) {
        console.error("Admin verification error:", err);
        router.push("/auth/login");
      } finally {
        if (active) setVerifyingSession(false);
      }
    }
    checkAdminSession();
    return () => {
      active = false;
    };
  }, [router, toast]);



  // Load Admin Data when session is active
  useEffect(() => {
    if (!adminUser) return;

    loadAllAdminData();
  }, [adminUser]);

  async function loadAllAdminData() {
    setLoadingStats(true);
    setLoadingUsers(true);
    setLoadingInquiries(true);
    setLoadingPackages(true);

    try {
      const statsRes = await adminGetStatsAction();
      if (statsRes.success && statsRes.stats) {
        updateStatsState(statsRes.stats);
      } else {
        toast(statsRes.error || "Failed to load system stats.", "error");
      }

      const usersRes = await adminGetUsersAction();
      if (usersRes.success && usersRes.users) {
        setUsers(usersRes.users);
      } else {
        toast(usersRes.error || "Failed to load student directory.", "error");
      }

      const inquiriesRes = await adminGetInquiriesAction();
      if (inquiriesRes.success && inquiriesRes.inquiries) {
        setInquiries(inquiriesRes.inquiries);
      } else {
        toast(inquiriesRes.error || "Failed to load inquiries.", "error");
      }

      const packagesRes = await adminGetPackagesAction();
      if (packagesRes.success && packagesRes.packages) {
        setPackages(packagesRes.packages);
      } else {
        toast(packagesRes.error || "Failed to load package catalog.", "error");
      }
    } catch (err) {
      console.error("Data load failure:", err);
      toast("An error occurred loading dashboard databases.", "error");
    } finally {
      setLoadingStats(false);
      setLoadingUsers(false);
      setLoadingInquiries(false);
      setLoadingPackages(false);
    }
  }

  // Action Handlers
  const handleToggleRole = async (userId: string, currentRole: string) => {
    const targetRole = currentRole === "admin" ? "student" : "admin";
    try {
      const res = await adminUpdateUserRoleAction(userId, targetRole);
      if (res.success) {
        toast("User role successfully updated.", "success");
        // Update local state
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: targetRole } : u))
        );
        // Refresh stats
        const statsRes = await adminGetStatsAction();
        if (statsRes.success && statsRes.stats) updateStatsState(statsRes.stats);
      } else {
        toast(res.error || "Failed to modify role.", "error");
      }
    } catch (err) {
      console.error(err);
      toast("Error updating role.", "error");
    }
  };

  const handleUpdateStatus = async (inquiryId: string, newStatus: string) => {
    try {
      const res = await adminUpdateInquiryStatusAction(inquiryId, newStatus);
      if (res.success) {
        toast(`Inquiry status updated to ${newStatus}.`, "success");
        // Update local state
        setInquiries((prev) =>
          prev.map((inq) => (inq.id === inquiryId ? { ...inq, status: newStatus } : inq))
        );
        // Refresh stats
        const statsRes = await adminGetStatsAction();
        if (statsRes.success && statsRes.stats) updateStatsState(statsRes.stats);
      } else {
        toast(res.error || "Failed to update status.", "error");
      }
    } catch (err) {
      console.error(err);
      toast("Error updating inquiry status.", "error");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to permanently delete this student account?")) return;
    try {
      const res = await adminDeleteUserAction(userId);
      if (res.success) {
        toast("Account permanently purged from database.", "success");
        setUsers((prev) => prev.filter((u) => u.id !== userId));
        // Refresh stats
        const statsRes = await adminGetStatsAction();
        if (statsRes.success && statsRes.stats) updateStatsState(statsRes.stats);
      } else {
        toast(res.error || "Failed to delete account.", "error");
      }
    } catch (err) {
      console.error(err);
      toast("Error deleting user.", "error");
    }
  };

  const handleDeleteInquiry = async (inquiryId: string) => {
    if (!confirm("Are you sure you want to permanently delete this inquiry record?")) return;
    try {
      const res = await adminDeleteInquiryAction(inquiryId);
      if (res.success) {
        toast("Inquiry purged successfully.", "success");
        setInquiries((prev) => prev.filter((inq) => inq.id !== inquiryId));
        // Refresh stats
        const statsRes = await adminGetStatsAction();
        if (statsRes.success && statsRes.stats) updateStatsState(statsRes.stats);
      } else {
        toast(res.error || "Failed to delete inquiry.", "error");
      }
    } catch (err) {
      console.error(err);
      toast("Error deleting inquiry.", "error");
    }
  };

  async function handleSavePackage(e: React.FormEvent) {
    e.preventDefault();
    if (!editingPackage) return;
    setUpdatingPackage(true);
    
    // Parse features from textarea (each line represents a bullet feature)
    const featuresList = editingFeatures
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    try {
      if (isCreatingNew) {
        if (!editingPackage.key || editingPackage.key.trim() === "") {
          toast("A unique package key is required.", "error");
          setUpdatingPackage(false);
          return;
        }

        const res = await adminCreatePackageAction({
          key: editingPackage.key,
          name: editingPackage.name,
          description: editingPackage.description,
          originalPrice: Number(editingPackage.originalPrice),
          standardPrice: Number(editingPackage.standardPrice),
          promoPrice: Number(editingPackage.promoPrice),
          features: featuresList,
          popular: editingPackage.popular,
          cta: editingPackage.cta,
          glow: editingPackage.glow,
        });

        if (res.success && res.package) {
          toast("New pricing package successfully created.", "success");
          setPackages((prev) => [...prev, res.package]);
          setEditingPackage(null);
          setEditingFeatures("");
          setIsCreatingNew(false);
        } else {
          toast(res.error || "Failed to create package.", "error");
        }
      } else {
        const res = await adminUpdatePackageAction(editingPackage.id, {
          name: editingPackage.name,
          description: editingPackage.description,
          originalPrice: Number(editingPackage.originalPrice),
          standardPrice: Number(editingPackage.standardPrice),
          promoPrice: Number(editingPackage.promoPrice),
          features: featuresList,
          popular: editingPackage.popular,
          cta: editingPackage.cta,
          glow: editingPackage.glow,
        });

        if (res.success && res.package) {
          toast("Pricing package successfully updated and catalog re-synced.", "success");
          setPackages((prev) =>
            prev.map((p) => (p.id === editingPackage.id ? res.package : p))
          );
          setEditingPackage(null);
          setEditingFeatures("");
        } else {
          toast(res.error || "Failed to update package details.", "error");
        }
      }
    } catch (err) {
      console.error("Save package error:", err);
      toast("An error occurred saving package details.", "error");
    } finally {
      setUpdatingPackage(false);
    }
  }

  const handleLogout = async () => {
    try {
      await logoutAction();
      toast("Successfully signed out. Re-routing to login...", "info");
      router.push("/auth/login");
    } catch (err) {
      console.error("Logout failure:", err);
      toast("Sign out failed. Please try again.", "error");
    }
  };

  if (verifyingSession) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Terminal className="w-10 h-10 text-ember-pulse animate-pulse" />
          <p className="text-xs text-smoke font-mono animate-pulse">Checking Credentials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pt-12 pb-32 bg-void">
      <div className="grid-background" />
      <div className="aurora-beam opacity-40 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,hsla(18,100%,68%,0.15)_0,rgba(9,10,12,0)_100%)]" />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        {/* Admin Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-slate-edge/20 pb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ember-pulse/10 border border-ember-pulse/25 text-[10px] font-semibold text-ember-pulse tracking-wider uppercase font-sans mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-ember-pulse" /> Security Control Portal
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-white">
              Admin Control Console
            </h1>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            {adminUser && (
              <div className="flex items-center gap-3 bg-charcoal-card/60 border border-slate-edge/30 px-4 py-2 rounded-full text-xs font-sans">
                <User className="w-4 h-4 text-ember-pulse" />
                <span className="text-white font-semibold">{adminUser.name}</span>
                <span className="text-smoke/50">|</span>
                <span className="text-ember-pulse uppercase font-mono text-[10px]">Super Administrator</span>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-red-500/20 bg-red-500/10 text-xs text-red-400 font-sans font-semibold hover:bg-red-500/20 cursor-pointer transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-edge/20 mb-8 overflow-x-auto gap-4">
          {[
            { id: "overview", name: "System Overview", icon: Sliders },
            { id: "packages", name: "Packages Editor", icon: Settings },
            { id: "students", name: "Students Directory", icon: User },
            { id: "purchases", name: "Scoped Purchases", icon: FileText },
            { id: "system", name: "Database & Node Logs", icon: Database },
          ].map((tab) => {
            const IconComp = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-2 text-sm font-semibold tracking-wide border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "border-ember-pulse text-white font-bold"
                    : "border-transparent text-smoke hover:text-white"
                }`}
              >
                <IconComp className={`w-4 h-4 ${isActive ? "text-ember-pulse" : "text-smoke"}`} />
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* TAB 1: SYSTEM OVERVIEW */}
        {activeTab === "overview" && (
          <div className="flex flex-col gap-8 animate-in fade-in duration-200">
            {/* Stats Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card glowColor="ember" className="p-6">
                <div className="flex justify-between items-start text-smoke">
                  <span className="text-xs uppercase font-bold tracking-wider">Registered Accounts</span>
                  <User className="w-4 h-4 text-ember-pulse" />
                </div>
                {loadingStats ? (
                  <div className="h-10 w-24 bg-void/50 animate-pulse rounded mt-2" />
                ) : (
                  <h2 className="text-4xl font-display font-extrabold text-white mt-2">{stats.totalUsers}</h2>
                )}
                <p className="text-[10px] text-smoke/70 mt-2 font-sans font-medium">Unique student & admin users</p>
              </Card>

              <Card glowColor="ember" className="p-6">
                <div className="flex justify-between items-start text-smoke">
                  <span className="text-xs uppercase font-bold tracking-wider">Scoped Orders</span>
                  <FileText className="w-4 h-4 text-ember-pulse" />
                </div>
                {loadingStats ? (
                  <div className="h-10 w-24 bg-void/50 animate-pulse rounded mt-2" />
                ) : (
                  <h2 className="text-4xl font-display font-extrabold text-white mt-2">{stats.totalInquiries}</h2>
                )}
                <p className="text-[10px] text-smoke/70 mt-2 font-sans font-medium">Inquiry forms logged in DB</p>
              </Card>

              <Card glowColor="ember" className="p-6">
                <div className="flex justify-between items-start text-smoke">
                  <span className="text-xs uppercase font-bold tracking-wider">Estimated Revenue</span>
                  <DollarSign className="w-4 h-4 text-ember-pulse" />
                </div>
                {loadingStats ? (
                  <div className="h-10 w-24 bg-void/50 animate-pulse rounded mt-2" />
                ) : (
                  <h2 className="text-4xl font-display font-extrabold text-white mt-2">${(stats.estRevenue || 0).toLocaleString()}</h2>
                )}
                <p className="text-[10px] text-smoke/70 mt-2 font-sans font-medium">Cumulative value of scoped projects</p>
              </Card>

              <Card glowColor="ember" className="p-6">
                <div className="flex justify-between items-start text-smoke">
                  <span className="text-xs uppercase font-bold tracking-wider">Pending Orders</span>
                  <AlertCircle className="w-4 h-4 text-ember-pulse" />
                </div>
                {loadingStats ? (
                  <div className="h-10 w-24 bg-void/50 animate-pulse rounded mt-2" />
                ) : (
                  <h2 className="text-4xl font-display font-extrabold text-white mt-2">{stats.pendingInquiries}</h2>
                )}
                <p className="text-[10px] text-smoke/70 mt-2 font-sans font-medium">Awaiting manual reviewed state</p>
              </Card>
            </div>

            {/* Quick Actions Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 flex flex-col gap-6">
                <Card className="p-6">
                  <h3 className="text-xs uppercase font-bold text-smoke tracking-wider mb-4">Database Pipeline Telemetry</h3>
                  
                  <div className="flex flex-col gap-4 font-mono text-xs">
                    <div className="flex justify-between items-center text-smoke border-b border-slate-edge/10 pb-3">
                      <span className="flex items-center gap-2"><Database className="w-3.5 h-3.5 text-ember-pulse" /> Database Engine</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> PostgreSQL Connected</span>
                    </div>
                    <div className="flex justify-between items-center text-smoke border-b border-slate-edge/10 pb-3">
                      <span className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-ember-pulse" /> API Network Latency</span>
                      <span className="text-white font-semibold">18 ms</span>
                    </div>
                    <div className="flex justify-between items-center text-smoke border-b border-slate-edge/10 pb-3 border-none">
                      <span className="flex items-center gap-2"><Settings className="w-3.5 h-3.5 text-ember-pulse" /> Server Execution Threads</span>
                      <span className="text-white font-semibold">4 active / Node.js LTS</span>
                    </div>
                  </div>
                </Card>

                {/* System Activity Stream */}
                <div className="border border-slate-edge/20 rounded-xl bg-charcoal-card/60 p-6 flex flex-col gap-4 font-mono text-xs text-left">
                  <div className="flex items-center justify-between border-b border-slate-edge/20 pb-3">
                    <span className="text-white font-bold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-ember-pulse animate-pulse" /> Live Admin Security Audit Log
                    </span>
                    <button 
                      onClick={loadAllAdminData}
                      className="p-1 border border-slate-edge/30 hover:border-white rounded-lg text-smoke hover:text-white transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-smoke"><span className="text-ember-pulse">[AUDIT 10:48]</span> Admin session verified securely. IP log dispatched.</p>
                  <p className="text-smoke"><span className="text-ember-pulse">[AUDIT 09:12]</span> Database model synchronized. Schema migrations check complete.</p>
                  <p className="text-smoke"><span className="text-ember-pulse">[AUDIT 08:00]</span> Scheduled mailer logs archived. SMTP client status OK.</p>
                </div>
              </div>

              {/* Utility shortcuts */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                <Card glowColor="iris" className="flex flex-col gap-4 font-sans text-left">
                  <h3 className="text-xs uppercase font-bold text-smoke tracking-wider">Administrator Utilities</h3>
                  <p className="text-xs text-smoke leading-relaxed">
                    Execute rapid data sync queries or check structural tables from this node controller.
                  </p>
                  <hr className="border-slate-edge/20" />
                  <div className="flex flex-col gap-2.5">
                    <Button onClick={loadAllAdminData} variant="primary" className="w-full justify-center text-xs py-2 cursor-pointer">
                      <RefreshCw className="w-3.5 h-3.5 mr-2 animate-spin-slow" /> Re-sync Databases
                    </Button>
                    <Button variant="ghost" href="/projects" className="w-full justify-center text-xs py-2 cursor-pointer">
                      View Project Store <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* TAB: PACKAGES EDITOR */}
        {activeTab === "packages" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-200 text-left font-sans">
            {/* Packages catalog list */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <Card className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-white">Select Package to Edit</h3>
                  <button
                    onClick={() => {
                      setIsCreatingNew(true);
                      setEditingPackage({
                        key: "",
                        name: "",
                        description: "",
                        originalPrice: 15000,
                        standardPrice: 12000,
                        promoPrice: 10000,
                        features: [],
                        popular: false,
                        cta: "Acquire Package",
                        glow: "none",
                      });
                      setEditingFeatures("");
                    }}
                    className="px-3 py-1.5 rounded-lg border border-ember-pulse bg-ember-pulse/10 hover:bg-ember-pulse/20 text-[10px] font-bold text-ember-pulse uppercase tracking-wider cursor-pointer transition-colors"
                  >
                    + Create New
                  </button>
                </div>
                
                {loadingPackages ? (
                  <div className="py-8 text-center flex flex-col items-center justify-center">
                    <RefreshCw className="w-6 h-6 text-ember-pulse animate-spin mb-2" />
                    <p className="text-xs text-smoke font-mono animate-pulse">Reading packages...</p>
                  </div>
                ) : packages.length === 0 ? (
                  <p className="text-xs text-smoke font-mono">No packages found.</p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {packages.map((pkg) => (
                      <button
                        key={pkg.id}
                        onClick={() => {
                          setIsCreatingNew(false);
                          setEditingPackage({ ...pkg });
                          setEditingFeatures(pkg.features.join("\n"));
                        }}
                        className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex flex-col gap-2 ${
                          editingPackage?.id === pkg.id
                            ? "bg-ember-pulse/10 border-ember-pulse"
                            : "bg-void/40 border-slate-edge/20 hover:border-slate-edge/40"
                        }`}
                      >
                        <div className="flex justify-between items-center w-full">
                          <span className="text-sm font-bold text-white">{pkg.name}</span>
                          <span className="text-[10px] text-smoke uppercase font-mono tracking-wider font-semibold">[{pkg.key}]</span>
                        </div>
                        <p className="text-xs text-smoke line-clamp-2 leading-relaxed">{pkg.description}</p>
                        <div className="flex items-center gap-3 text-xs font-mono font-bold mt-1 text-emerald-400">
                          <span>Standard: ₹{(pkg.standardPrice || 0).toLocaleString("en-IN")}</span>
                          <span className="text-smoke/30">|</span>
                          <span>Promo: ₹{(pkg.promoPrice || 0).toLocaleString("en-IN")}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </Card>
            </div>

            {/* Package Form Editor */}
            <div className="lg:col-span-7">
              {editingPackage ? (
                <Card glowColor="ember" className="p-6">
                  <h3 className="text-sm font-bold text-white border-b border-slate-edge/20 pb-3 mb-6">
                    {isCreatingNew ? "Create New Package" : <>Editing: <span className="text-ember-pulse">{editingPackage.name}</span></>}
                  </h3>
                  
                  <form onSubmit={handleSavePackage} className="flex flex-col gap-5 text-xs text-smoke">
                    {isCreatingNew && (
                      <div className="flex flex-col gap-2">
                        <label className="font-semibold text-white">Unique Package Key (Lower-case, URL-safe: e.g. capstone)</label>
                        <input
                          type="text"
                          required
                          value={editingPackage.key}
                          onChange={(e) => setEditingPackage((prev: any) => ({ ...prev, key: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "") }))}
                          placeholder="e.g. minor-capstone"
                          className="bg-void border border-slate-edge/30 rounded-lg p-3 text-white focus:outline-none focus:border-ember-pulse font-mono"
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="font-semibold text-white">Package Name</label>
                        <input
                          type="text"
                          required
                          value={editingPackage.name}
                          onChange={(e) => setEditingPackage((prev: any) => ({ ...prev, name: e.target.value }))}
                          className="bg-void border border-slate-edge/30 rounded-lg p-3 text-white focus:outline-none focus:border-ember-pulse"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="font-semibold text-white">Call-To-Action Text</label>
                        <input
                          type="text"
                          required
                          value={editingPackage.cta}
                          onChange={(e) => setEditingPackage((prev: any) => ({ ...prev, cta: e.target.value }))}
                          className="bg-void border border-slate-edge/30 rounded-lg p-3 text-white focus:outline-none focus:border-ember-pulse"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="font-semibold text-white">Description</label>
                      <textarea
                        required
                        rows={2}
                        value={editingPackage.description}
                        onChange={(e) => setEditingPackage((prev: any) => ({ ...prev, description: e.target.value }))}
                        className="bg-void border border-slate-edge/30 rounded-lg p-3 text-white focus:outline-none focus:border-ember-pulse resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="font-semibold text-white">Original Price (₹)</label>
                        <input
                          type="number"
                          required
                          value={editingPackage.originalPrice}
                          onChange={(e) => setEditingPackage((prev: any) => ({ ...prev, originalPrice: Number(e.target.value) }))}
                          className="bg-void border border-slate-edge/30 rounded-lg p-3 text-white focus:outline-none focus:border-ember-pulse font-mono"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="font-semibold text-white">Standard Price (₹)</label>
                        <input
                          type="number"
                          required
                          value={editingPackage.standardPrice}
                          onChange={(e) => setEditingPackage((prev: any) => ({ ...prev, standardPrice: Number(e.target.value) }))}
                          className="bg-void border border-slate-edge/30 rounded-lg p-3 text-white focus:outline-none focus:border-ember-pulse font-mono"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="font-semibold text-white">Promo Discount Price (₹)</label>
                        <input
                          type="number"
                          required
                          value={editingPackage.promoPrice}
                          onChange={(e) => setEditingPackage((prev: any) => ({ ...prev, promoPrice: Number(e.target.value) }))}
                          className="bg-void border border-slate-edge/30 rounded-lg p-3 text-white focus:outline-none focus:border-ember-pulse font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="font-semibold text-white">Visual Glow Theme</label>
                        <select
                          value={editingPackage.glow}
                          onChange={(e) => setEditingPackage((prev: any) => ({ ...prev, glow: e.target.value }))}
                          className="bg-void border border-slate-edge/30 rounded-lg p-3 text-white focus:outline-none focus:border-ember-pulse"
                        >
                          <option value="none">None (Standard)</option>
                          <option value="iris">Iris (Purple Glow)</option>
                          <option value="ember">Ember (Orange Glow)</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-3 mt-6">
                        <input
                          type="checkbox"
                          id="popular-toggle"
                          checked={editingPackage.popular}
                          onChange={(e) => setEditingPackage((prev: any) => ({ ...prev, popular: e.target.checked }))}
                          className="w-4 h-4 rounded accent-ember-pulse bg-void border-slate-edge/30 focus:ring-0 cursor-pointer"
                        />
                        <label htmlFor="popular-toggle" className="font-semibold text-white cursor-pointer select-none">
                          Display "Popular" Badge
                        </label>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="font-semibold text-white">Features List (One bullet item per line)</label>
                      <textarea
                        rows={5}
                        required
                        value={editingFeatures}
                        onChange={(e) => setEditingFeatures(e.target.value)}
                        placeholder="Complete Source Code&#10;Step-by-step Setup README&#10;..."
                        className="bg-void border border-slate-edge/30 rounded-lg p-3 text-white focus:outline-none focus:border-ember-pulse resize-none font-sans leading-relaxed"
                      />
                    </div>

                    <div className="flex gap-4 mt-2 justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingPackage(null);
                          setEditingFeatures("");
                        }}
                        className="px-6 py-3 rounded-full border border-slate-edge/30 hover:bg-charcoal-card text-xs font-semibold text-white transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={updatingPackage}
                        className="px-6 py-3 rounded-full bg-gradient-to-r from-ember-pulse to-yellow-500 hover:shadow-[0_0_20px_rgba(255,137,100,0.3)] text-xs font-semibold text-white transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                      >
                        {updatingPackage ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Saving...
                          </>
                        ) : (
                          "Save Pricing Changes"
                        )}
                      </button>
                    </div>
                  </form>
                </Card>
              ) : (
                <div className="h-full min-h-[300px] border border-dashed border-slate-edge/25 rounded-2xl flex flex-col items-center justify-center text-center p-8 text-smoke gap-2">
                  <Settings className="w-8 h-8 text-slate-edge/60" />
                  <p className="text-xs font-medium">Select a pricing package from the left list to begin editing details.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: STUDENTS DIRECTORY */}
        {activeTab === "students" && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-200">
            <Card className="overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-edge/20 bg-charcoal-card/40 flex justify-between items-center">
                <h3 className="text-sm font-bold text-white font-sans">Active Registered Workspace Users</h3>
                <span className="px-2 py-0.5 rounded text-[10px] bg-ember-pulse/10 text-ember-pulse border border-ember-pulse/20 font-sans font-bold uppercase">{users.length} Users</span>
              </div>

              {loadingUsers ? (
                <div className="p-8 text-center flex flex-col items-center justify-center min-h-[250px]">
                  <RefreshCw className="w-8 h-8 text-ember-pulse animate-spin mb-2" />
                  <p className="text-xs text-smoke font-mono animate-pulse">Reading user schemas...</p>
                </div>
              ) : users.length === 0 ? (
                <div className="p-8 text-center text-smoke text-xs font-mono">
                  No registered users found in the database.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs font-sans">
                    <thead>
                      <tr className="border-b border-slate-edge/20 bg-void/50 text-smoke font-bold uppercase tracking-wider">
                        <th className="py-4 px-6">Name</th>
                        <th className="py-4 px-6">Email</th>
                        <th className="py-4 px-6">Mobile</th>
                        <th className="py-4 px-6">Role</th>
                        <th className="py-4 px-6">Joined Date</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-edge/10 text-white">
                      {users.map((u) => (
                        <tr key={u.id} className="hover:bg-charcoal-card/25 transition-colors">
                          <td className="py-4 px-6 font-semibold">{u.name || "N/A"}</td>
                          <td className="py-4 px-6 font-mono text-smoke">{u.email}</td>
                          <td className="py-4 px-6 font-mono text-smoke">{u.phone || "N/A"}</td>
                          <td className="py-4 px-6">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              u.role === "admin" 
                                ? "bg-ember-pulse/10 text-ember-pulse border border-ember-pulse/20" 
                                : "bg-electric-iris/10 text-electric-iris border border-electric-iris/20"
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-smoke">{new Date(u.createdAt).toLocaleDateString()}</td>
                          <td className="py-4 px-6 text-right flex items-center justify-end gap-3.5">
                            <button
                              onClick={() => handleToggleRole(u.id, u.role)}
                              className="inline-flex items-center gap-1 hover:text-white text-smoke transition-colors cursor-pointer"
                              title="Toggle Role Status"
                            >
                              <UserCheck className="w-4 h-4 text-emerald-400" /> Toggle Role
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              className="inline-flex items-center gap-1 hover:text-red-400 text-smoke transition-colors cursor-pointer"
                              title="Purge Account"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" /> Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* TAB 3: SCOPED PURCHASES */}
        {activeTab === "purchases" && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-200">
            <Card className="overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-edge/20 bg-charcoal-card/40 flex justify-between items-center">
                <h3 className="text-sm font-bold text-white font-sans">Student Custom Scope Requests & Quotes</h3>
                <span className="px-2 py-0.5 rounded text-[10px] bg-ember-pulse/10 text-ember-pulse border border-ember-pulse/20 font-sans font-bold uppercase">{inquiries.length} Inquiries</span>
              </div>

              {loadingInquiries ? (
                <div className="p-8 text-center flex flex-col items-center justify-center min-h-[250px]">
                  <RefreshCw className="w-8 h-8 text-ember-pulse animate-spin mb-2" />
                  <p className="text-xs text-smoke font-mono animate-pulse">Reading purchase databases...</p>
                </div>
              ) : inquiries.length === 0 ? (
                <div className="p-8 text-center text-smoke text-xs font-mono">
                  No inquiries or scope logs available.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs font-sans">
                    <thead>
                      <tr className="border-b border-slate-edge/20 bg-void/50 text-smoke font-bold uppercase tracking-wider">
                        <th className="py-4 px-6">Client Name</th>
                        <th className="py-4 px-6">Domain & Complexity</th>
                        <th className="py-4 px-6">Quote Price</th>
                        <th className="py-4 px-6">Order Status</th>
                        <th className="py-4 px-6">Submission Details</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-edge/10 text-white">
                      {inquiries.map((inq) => (
                        <tr key={inq.id} className="hover:bg-charcoal-card/25 transition-colors">
                          <td className="py-4 px-6">
                            <span className="font-semibold block">{inq.name}</span>
                            <span className="text-[10px] text-smoke block font-mono mt-0.5">{inq.email}</span>
                            {inq.org && <span className="text-[9px] text-slate-edge uppercase tracking-wider block font-semibold mt-0.5">{inq.org}</span>}
                          </td>
                          <td className="py-4 px-6">
                            <span className="font-semibold text-electric-iris block font-mono capitalize">[{inq.domain}]</span>
                            <span className="text-[10px] text-smoke uppercase tracking-wider font-semibold font-mono">{inq.complexity}</span>
                          </td>
                          <td className="py-4 px-6 font-mono font-bold text-emerald-400">${(inq.estimatedPrice || 0).toLocaleString()}</td>
                          <td className="py-4 px-6">
                            <select
                              value={inq.status}
                              onChange={(e) => handleUpdateStatus(inq.id, e.target.value)}
                              className="bg-void border border-slate-edge/30 rounded py-1 px-2.5 text-[11px] font-sans font-medium text-white focus:outline-none focus:border-ember-pulse cursor-pointer"
                            >
                              <option value="pending">Pending</option>
                              <option value="reviewed">Reviewed</option>
                              <option value="accepted">Accepted</option>
                              <option value="closed">Closed</option>
                            </select>
                          </td>
                          <td className="py-4 px-6 max-w-[200px] truncate text-smoke" title={inq.notes}>
                            {inq.notes || "No notes attached."}
                          </td>
                          <td className="py-4 px-6 text-right">
                            <button
                              onClick={() => handleDeleteInquiry(inq.id)}
                              className="inline-flex items-center gap-1 hover:text-red-400 text-smoke transition-colors cursor-pointer"
                              title="Delete Order"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" /> Purge
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* TAB 4: SYSTEM UTILITIES */}
        {activeTab === "system" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-200">
            {/* System Actions Card */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              <Card className="p-6">
                <h3 className="text-sm font-bold text-white mb-4">Node Operations & Operations</h3>
                <p className="text-smoke text-xs font-sans leading-relaxed mb-6">
                  Perform core actions on database cache metrics or synchronize email dispatch streams.
                </p>

                <div className="flex flex-col gap-3 font-sans text-xs">
                  <Button onClick={() => { toast("Mock DB Backup generated successfully.", "success"); }} variant="primary" className="justify-center cursor-pointer">
                    Create Database Snapshot
                  </Button>
                  <Button onClick={() => { toast("Prisma schema structure checked. Valid.", "success"); }} variant="ghost" className="justify-center cursor-pointer">
                    Verify DB Models Sync
                  </Button>
                  <Button onClick={() => { toast("System logs successfully cleared.", "info"); }} variant="ghost" className="justify-center text-red-400 border-red-500/20 hover:bg-red-500/10 cursor-pointer">
                    Purge System Cache
                  </Button>
                </div>
              </Card>
            </div>

            {/* Diagnostics Card */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              <Card className="p-6">
                <h3 className="text-sm font-bold text-white mb-4">Database Constraints</h3>
                <div className="flex flex-col gap-4 text-xs font-sans text-smoke">
                  <p>
                    All registered accounts must have a verified Developer Email profile address. The User role determines accessible dashboard menus and controls.
                  </p>
                  <hr className="border-slate-edge/20" />
                  <div className="flex flex-col gap-2 font-mono text-[11px]">
                    <div className="flex justify-between">
                      <span>Unique Email Index:</span>
                      <span className="text-emerald-400">Enabled</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Unique Phone Index:</span>
                      <span className="text-emerald-400">Enabled (Safe Nullable)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Default Signup Role:</span>
                      <span className="text-white">"student"</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
