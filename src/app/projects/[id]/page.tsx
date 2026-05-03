import { getProjects } from "@/app/actions/projects";
import { getProjectCostItems } from "@/app/actions/cost-items";
import CalculatorWrapper from "@/components/calculator/calculator-wrapper";
import { notFound } from "next/navigation";
import { CostItem } from "@/lib/types";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  
  const projects = await getProjects();
  const project = projects.find((p) => p.id === id);

  if (!project) {
    notFound();
  }

  const costItemsRaw = await getProjectCostItems(id);
  const costItems: CostItem[] = costItemsRaw.map(item => ({
    id: item.id,
    projectId: item.projectId,
    type: item.type as any,
    name: item.description,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    metadata: item.metadata as any
  }));

  return (
    <CalculatorWrapper 
      project={project} 
      initialItems={costItems} 
    />
  );
}
