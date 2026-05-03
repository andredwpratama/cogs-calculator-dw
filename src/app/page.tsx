import { getProjects, createProject } from "@/app/actions/projects";
import { Button } from "@/components/ui/button";
import { Plus, FolderOpen, Clock, Filter } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { DeleteProjectButton } from "@/components/ui/delete-project-button";

export default async function Dashboard() {
  const projects = await getProjects();

  async function handleCreateProject(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    const id = await createProject(name || "Untitled Project");
    redirect(`/projects/${id}`);
  }

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div className="flex flex-col gap-1 min-w-0">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Active Projects</h2>
          <p className="text-slate-500 mt-1">Monitor real-time performance metrics and profitability across your portfolio.</p>
        </div>
        <div className="flex gap-3 items-center shrink-0">
           <form action={handleCreateProject} className="flex gap-2">
            <input 
              name="name" 
              placeholder="New Project Name" 
              className="px-4 py-2 border border-slate-200 rounded-xl bg-white focus:ring-[#ec5b13] outline-none text-sm w-48 md:w-64"
            />
            <Button type="submit" className="bg-[#ec5b13] hover:bg-orange-600 text-white font-bold rounded-xl shadow-md shadow-orange-200">
              <Plus className="w-4 h-4 mr-2" /> New Project
            </Button>
          </form>
          <Button variant="outline" className="border-slate-200 rounded-xl font-bold hidden sm:flex">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
        </div>
      </div>

      {/* Dashboard Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Revenue" value="$2.4M" trend="+12%" />
        <StatCard title="Average GP%" value="31.2%" trend="+2.4%" />
        <StatCard title="Active Resources" value="84" sub="In-field" />
        <StatCard title="Risk Score" value="Low" sub="Stable" color="text-emerald-600" />
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed rounded-2xl bg-muted/5">
          <FolderOpen className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-xl font-medium text-muted-foreground">No projects found.</p>
          <p className="text-sm text-muted-foreground">Create your first estimation above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="relative min-w-0">
              <div className="absolute top-4 right-4 flex gap-2 z-50">
                <DeleteProjectButton id={project.id} />
                <div className="bg-emerald-500 text-white text-[10px] font-black uppercase px-2 py-1 rounded shadow-lg whitespace-nowrap">On Track</div>
              </div>
              <Link href={`/projects/${project.id}`} className="block group">
                <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="h-40 bg-slate-900 relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                       <h4 className="text-lg font-black text-white leading-tight truncate" title={project.name}>{project.name}</h4>
                       <p className="text-slate-300 text-xs mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Updated {new Date(project.updatedAt).toLocaleDateString()}
                       </p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4 pt-0 border-t border-slate-100">
                      <div className="min-w-0">
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Overhead</p>
                        <p className="text-base font-black text-slate-900 truncate">{project.overheadPercent}%</p>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Target GP</p>
                        <p className="text-base font-black text-slate-900 truncate">{project.gpPercent}%</p>
                      </div>
                    </div>
                    <div className="mt-6">
                      <div className="w-full py-2 bg-slate-50 text-slate-900 text-center text-sm font-bold rounded-xl border border-slate-200 group-hover:bg-[#ec5b13] group-hover:text-white group-hover:border-[#ec5b13] transition-all">
                        View Full Metrics
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  trend?: string;
  sub?: string;
  color?: string;
}

function StatCard({ title, value, trend, sub, color = "text-slate-900" }: StatCardProps) {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm min-w-0">
      <p className="text-slate-500 text-sm font-medium truncate" title={title}>{title}</p>
      <div className="flex items-baseline gap-2 mt-1 min-w-0">
        <h3 className={`text-2xl font-black truncate ${color}`} title={value}>{value}</h3>
        {trend && <span className="text-emerald-500 text-xs font-bold whitespace-nowrap">{trend}</span>}
        {sub && <span className="text-slate-400 text-xs font-bold truncate">{sub}</span>}
      </div>
    </div>
  );
}
