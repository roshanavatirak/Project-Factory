"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Terminal, GitBranch, Clock, BookOpen, 
  HelpCircle, MessageSquare, ExternalLink, ShieldCheck,
  User, Download, LogOut 
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { getInquiriesAction } from "@/app/actions/inquiry";
import { getSessionAction, logoutAction } from "@/app/actions/auth";
import { useToast } from "@/components/Toast";

export default function DashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [user, setUser] = useState<any>(null);
  const [verifyingSession, setVerifyingSession] = useState(true);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "milestones" | "docs" | "support">("overview");

  // 1. Session check on page mount
  useEffect(() => {
    let active = true;
    async function checkSession() {
      try {
        const session = await getSessionAction();
        if (session.success && session.user) {
          if (active) {
            setUser(session.user);
            // Display welcome toast only once per browser tab session
            const hasWelcomed = sessionStorage.getItem("pf_welcomed");
            if (!hasWelcomed) {
              toast(`Secure session active. Welcome back, ${session.user.name}!`, "success");
              sessionStorage.setItem("pf_welcomed", "true");
            }
          }
        } else {
          router.push("/auth/login");
        }
      } catch (err) {
        console.error("Session verification failure:", err);
        router.push("/auth/login");
      } finally {
        if (active) setVerifyingSession(false);
      }
    }
    checkSession();
    return () => {
      active = false;
    };
  }, [router, toast]);

  // 2. Fetch isolated database inquiries for the logged-in user email
  useEffect(() => {
    if (!user) return;

    async function loadInquiries() {
      try {
        const res = await getInquiriesAction(user.email);
        if (res.success && res.inquiries) {
          setInquiries(res.inquiries);
        }
      } catch (err) {
        console.error("Inquiries fetch failure:", err);
      } finally {
        setLoadingInquiries(false);
      }
    }
    loadInquiries();
  }, [user]);

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

  // Ticket states
  const [ticketTopic, setTicketTopic] = useState("");
  const [ticketDesc, setTicketDesc] = useState("");

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketTopic.trim() || !ticketDesc.trim()) {
      toast("Please fill in both the ticket topic and description.", "error");
      return;
    }
    toast("Support ticket logged successfully! Our team will email you.", "success");
    setTicketTopic("");
    setTicketDesc("");
  };

  const projectDetails = {
    status: "In Progress",
    completionRate: 75,
    startDate: "June 15, 2026",
    deliveryDate: "July 12, 2026",
    architect: "Aravind K. (Senior Lead AI Engineer)",
    gitBranch: "feature/langgraph-agent-mesh"
  };

  const milestones = [
    { name: "Repository Init & Webpack setup", status: "completed", date: "June 16, 2026" },
    { name: "Model Context Protocol (MCP) server connector integration", status: "completed", date: "June 22, 2026" },
    { name: "LangGraph state router & CrewAI agents config setup", status: "completed", date: "June 28, 2026" },
    { name: "FastAPI stream pipeline integration & real-time websocket tests", status: "in-progress", date: "Target: July 5, 2026" },
    { name: "Client dashboard portal & docker container builds", status: "pending", date: "Target: July 9, 2026" },
    { name: "Handover credentials documentation", status: "pending", date: "Target: July 12, 2026" }
  ];

  const docs = [
    { title: "Project Architectural Breakdown", type: "PDF Specs", duration: "12 pages" },
    { title: "Docker Compose Local Stack configs", type: "YML Code", duration: "Lines 1-84" },
    { title: "CrewAI Multi-Agent task logic walkthrough", type: "Video Guide", duration: "18 minutes" },
    { title: "PostgreSQL Database Migration commands", type: "SQL Script", duration: "Lines 1-32" }
  ];

  const supportLogs = [
    { id: "1084", topic: "Docker build fails on WSL-2 environment", status: "Resolved", date: "June 24, 2026" },
    { id: "1122", topic: "Finetuning confidence thresholds on YOLO nodes", status: "In progress", date: "July 2, 2026" }
  ];

  if (verifyingSession) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Terminal className="w-10 h-10 text-electric-iris animate-pulse" />
          <p className="text-xs text-smoke font-mono animate-pulse">Authenticating Session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pt-12 pb-32 bg-void">
      <div className="grid-background" />
      <div className="aurora-beam" />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-slate-edge/20 pb-8">
          <div>
            <span className="text-xs font-semibold text-smoke uppercase tracking-wider font-sans">
              Workspace Portal
            </span>
            <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-white mt-1">
              Active Project Dashboard
            </h1>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            {user && (
              <div className="flex items-center gap-3 bg-charcoal-card/60 border border-slate-edge/30 px-4 py-2 rounded-full text-xs font-sans">
                <User className="w-4 h-4 text-electric-iris" />
                <span className="text-white font-semibold">{user.name}</span>
                <span className="text-smoke/50">|</span>
                <span className="text-smoke uppercase font-mono text-[10px]">{user.role}</span>
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
            { id: "overview", name: "Overview & Invoices", icon: Terminal },
            { id: "milestones", name: "Development Milestones", icon: GitBranch },
            { id: "docs", name: "Technical Documents", icon: BookOpen },
            { id: "support", name: "Support Tickets", icon: HelpCircle },
          ].map((tab) => {
            const IconComp = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-2 text-sm font-semibold tracking-wide border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "border-electric-iris text-white"
                    : "border-transparent text-smoke hover:text-white"
                }`}
              >
                <IconComp className="w-4 h-4" />
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-200">
            {/* Left overview */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {loadingInquiries ? (
                <Card className="p-8 flex items-center justify-center min-h-[300px]">
                  <p className="text-xs text-smoke font-mono animate-pulse">Reading secure tables...</p>
                </Card>
              ) : inquiries.length === 0 ? (
                <Card glowColor="iris" className="p-8 text-center flex flex-col items-center justify-center min-h-[320px] gap-4">
                  <div className="w-12 h-12 rounded-full bg-electric-iris/10 border border-electric-iris/25 flex items-center justify-center text-electric-iris">
                    <Terminal className="w-5 h-5 animate-pulse" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-white tracking-tight">No Purchases Found</h3>
                  <p className="text-smoke text-xs max-w-sm leading-relaxed">
                    You don't have any purchases or active project scopes linked to your account yet.
                    Scope an engineering requirement package or request custom modules to list active builds here.
                  </p>
                  <Button variant="primary" href="/contact" className="mt-2 text-xs py-2 px-6">
                    Book Project Build
                  </Button>
                </Card>
              ) : (
                <>
                  <Card className="p-8">
                    <h3 className="text-xs uppercase font-bold text-smoke tracking-wider font-sans">Current Build</h3>
                    <h2 className="font-display text-2xl font-bold tracking-tight text-white mt-1 mb-4 capitalize">
                      {inquiries[0].domain} Project Framework
                    </h2>
                    
                    {/* Progress bar */}
                    <div className="flex flex-col gap-2 mb-6">
                      <div className="flex justify-between text-xs text-smoke font-sans">
                        <span>Task Milestones Completed</span>
                        <strong className="text-white">{projectDetails.completionRate}%</strong>
                      </div>
                      <div className="w-full h-2 bg-void rounded-full overflow-hidden border border-slate-edge/20">
                        <div 
                          className="h-full bg-gradient-to-r from-electric-iris to-ember-pulse rounded-full" 
                          style={{ width: `${projectDetails.completionRate}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 font-sans text-xs text-smoke pt-6 border-t border-slate-edge/20">
                      <div>
                        <span>Active Developer</span>
                        <p className="text-white font-semibold mt-1">{projectDetails.architect}</p>
                      </div>
                      <div>
                        <span>Tracking Branch</span>
                        <p className="text-electric-iris font-mono font-semibold mt-1 flex items-center gap-1">
                          <GitBranch className="w-3.5 h-3.5" /> {projectDetails.gitBranch}
                        </p>
                      </div>
                      <div>
                        <span>Target Delivery Date</span>
                        <p className="text-white font-semibold mt-1">{projectDetails.deliveryDate}</p>
                      </div>
                    </div>
                  </Card>

                  {/* Dev Logs widget */}
                  <div className="border border-slate-edge/20 rounded-xl bg-charcoal-card/60 p-6 flex flex-col gap-4 font-mono text-xs">
                    <div className="flex items-center justify-between border-b border-slate-edge/20 pb-3">
                      <span className="text-white font-bold flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-electric-iris animate-pulse" /> Architect Dev Activity Log
                      </span>
                      <span className="text-iron-veil">Updated 10m ago</span>
                    </div>
                    <p className="text-smoke"><span className="text-electric-iris">[14:32:09]</span> Merged node-state types check variables into master branch.</p>
                    <p className="text-smoke"><span className="text-electric-iris">[11:15:42]</span> Configured local PostgreSQL dev server schemas migration scripts.</p>
                    <p className="text-smoke"><span className="text-electric-iris">[09:20:00]</span> Fixed API gateway timeout bug on model server execution threads.</p>
                  </div>
                </>
              )}

              {/* Live Database Inquiries log from Supabase */}
              {inquiries.length > 0 && (
                <div className="border border-slate-edge/20 rounded-xl bg-charcoal-card/60 p-6 flex flex-col gap-4 font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-slate-edge/20 pb-3">
                    <span className="text-white font-bold flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-electric-iris animate-pulse" /> Live Scoped Invoices & Quotes (Supabase)
                    </span>
                    <span className="text-iron-veil">Secured Client Workspace</span>
                  </div>
                  <div className="flex flex-col gap-3">
                    {inquiries.map((inq) => (
                      <div key={inq.id} className="flex justify-between items-center text-smoke border-b border-slate-edge/10 pb-3 last:border-0 last:pb-0">
                        <div>
                          <span className="text-electric-iris font-semibold font-mono">[{inq.domain.toUpperCase()}]</span> PF-{inq.id.slice(0,8).toUpperCase()}
                          <span className="text-[10px] text-smoke/50 block font-sans">Created on: {new Date(inq.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-4 text-right">
                          <div>
                            <strong className="text-white block font-sans">${inq.estimatedPrice}</strong>
                            <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-electric-iris/15 text-electric-iris border border-electric-iris/25 font-sans">{inq.complexity}</span>
                          </div>
                          {/* Invoice PDF download link */}
                          <a
                            href={`/api/invoice?id=${inq.id}`}
                            download
                            className="p-2 border border-slate-edge/40 hover:border-electric-iris rounded-lg text-smoke hover:text-white transition-colors cursor-pointer"
                            title="Download PDF Invoice"
                          >
                            <Download className="w-4 h-4 text-electric-iris" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Quick stats */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              {inquiries.length === 0 ? (
                <Card glowColor="ember" className="flex flex-col gap-4 font-sans text-left">
                  <h3 className="text-xs uppercase font-bold text-smoke tracking-wider">Getting Started</h3>
                  <p className="text-xs text-smoke leading-relaxed">
                    Welcome to Project Factory! Access standard engineering developer builds or design a custom software suite.
                  </p>
                  <hr className="border-slate-edge/20" />
                  <div className="flex flex-col gap-2.5">
                    <Button variant="primary" href="/contact" className="w-full justify-center text-xs py-2 cursor-pointer">
                      Book Project Scope
                    </Button>
                    <Button variant="white" href="/projects" className="w-full justify-center text-xs py-2 cursor-pointer">
                      Explore Catalog
                    </Button>
                  </div>
                </Card>
              ) : (
                <Card glowColor="ember" className="flex flex-col gap-4 font-sans text-left">
                  <h3 className="text-xs uppercase font-bold text-smoke tracking-wider">Assigned Architect</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-electric-iris/15 border border-electric-iris/30 flex items-center justify-center font-display font-bold text-electric-iris">
                      AK
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Aravind Kumar</h4>
                      <p className="text-[10px] text-smoke">Senior Systems & AI Lead</p>
                    </div>
                  </div>
                  <hr className="border-slate-edge/20" />
                  <Button variant="white" href="/contact" className="w-full justify-center text-xs py-2 cursor-pointer">
                    Request Sync Session
                  </Button>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: MILESTONES */}
        {activeTab === "milestones" && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-200">
            {inquiries.length === 0 ? (
              <Card className="p-8 text-center flex flex-col items-center justify-center min-h-[200px]">
                <p className="text-xs text-smoke font-mono">No active milestones. Build workspace is inactive.</p>
              </Card>
            ) : (
              milestones.map((m, idx) => (
                <Card key={idx} className="p-5 flex items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border mt-0.5 ${
                      m.status === "completed" 
                        ? "bg-electric-iris/15 border-electric-iris text-electric-iris" 
                        : m.status === "in-progress" 
                        ? "bg-ember-pulse/15 border-ember-pulse text-ember-pulse" 
                        : "bg-void border-slate-edge/30 text-smoke"
                    }`}>
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className={`text-sm font-semibold font-sans ${m.status === "completed" ? "line-through text-smoke/60" : "text-white"}`}>
                        {m.name}
                      </h4>
                      <span className="text-[10px] text-smoke font-sans mt-0.5 block">{m.date}</span>
                    </div>
                  </div>
                  <div>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      m.status === "completed"
                        ? "bg-electric-iris/15 text-electric-iris border border-electric-iris/20"
                        : m.status === "in-progress"
                        ? "bg-ember-pulse/15 text-ember-pulse border border-ember-pulse/20 animate-pulse"
                        : "bg-slate-edge/25 text-smoke border border-slate-edge/20"
                    }`}>
                      {m.status}
                    </span>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {/* TAB 3: DOCUMENTS */}
        {activeTab === "docs" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-200">
            {inquiries.length === 0 ? (
              <Card className="col-span-2 p-8 text-center flex flex-col items-center justify-center min-h-[200px]">
                <p className="text-xs text-smoke font-mono">No technical documents compiled yet.</p>
              </Card>
            ) : (
              docs.map((doc, idx) => (
                <Card key={idx} className="p-6 flex items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded bg-void border border-slate-edge/30 flex items-center justify-center text-electric-iris shrink-0 font-display font-bold text-xs uppercase">
                      {doc.type.split(" ")[0]}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white font-sans">{doc.title}</h4>
                      <span className="text-[10px] text-smoke font-sans mt-1 block">{doc.type} &bull; {doc.duration}</span>
                    </div>
                  </div>
                  <button className="p-2 border border-slate-edge/20 hover:border-white rounded-lg text-smoke hover:text-white cursor-pointer transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </Card>
              ))
            )}
          </div>
        )}

        {/* TAB 4: SUPPORT */}
        {activeTab === "support" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-200">
            {/* Ticket submit */}
            <div className="lg:col-span-5">
              <Card glowColor="iris" className="p-6 flex flex-col gap-4">
                <h3 className="font-display text-lg font-bold text-white tracking-wide">Open Support Ticket</h3>
                <p className="text-smoke text-xs font-sans leading-relaxed">
                  Stuck setting up environment variables or database connection layers? Log a ticket here and our leads will review it.
                </p>
                <form className="flex flex-col gap-4 font-sans text-xs mt-2" onSubmit={handleTicketSubmit}>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-semibold text-white">Ticket Topic</label>
                    <input
                      type="text"
                      required
                      value={ticketTopic}
                      onChange={(e) => setTicketTopic(e.target.value)}
                      placeholder="e.g. WSL-2 postgres connection fails"
                      className="bg-void border border-slate-edge/30 rounded-lg p-3 text-white focus:outline-none focus:border-electric-iris"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-semibold text-white">Issue Description</label>
                    <textarea
                      rows={3}
                      required
                      value={ticketDesc}
                      onChange={(e) => setTicketDesc(e.target.value)}
                      placeholder="Provide terminal error traceback..."
                      className="bg-void border border-slate-edge/30 rounded-lg p-3 text-white focus:outline-none focus:border-electric-iris resize-none"
                    />
                  </div>
                  <Button type="submit" variant="primary" className="w-full justify-center text-xs py-2.5 cursor-pointer">
                    Submit Ticket <MessageSquare className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </form>
              </Card>
            </div>

            {/* Ticket list */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <h3 className="font-display text-lg font-bold text-white tracking-wide">Active Tickets Log</h3>
              {supportLogs.map((log) => (
                <Card key={log.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded bg-void border border-slate-edge/20 flex items-center justify-center text-white shrink-0 font-display font-semibold text-xs">
                      #{log.id}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white font-sans">{log.topic}</h4>
                      <span className="text-[10px] text-smoke font-sans mt-0.5 block">{log.date}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${
                    log.status === "Resolved"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-ember-pulse/15 text-ember-pulse border border-ember-pulse/20 animate-pulse"
                  }`}>
                    {log.status}
                  </span>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
