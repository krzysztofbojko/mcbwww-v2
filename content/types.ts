export type L = { pl: string; en?: string };
export type ClusterId = "material-engineering" | "analysis-control" | "digital-tech" | "society-environment";
export interface Cluster { id: ClusterId; number: string; title: L; description: L }
export interface Service { slug: string; clusterId: ClusterId; title: L; image?: string; offer: L[]; expertIds: string[] }
export interface Expert { id: string; name: string; role: L; email: string }
export interface Equipment { slug: string; serviceSlug: string; clusterId: ClusterId; name: string; fullName: string; manufacturer?: string; specs: string[]; isFlagship: boolean; flagshipHighlight?: L }
export interface Project { id: number; status: "w_trakcie" | "zrealizowane"; title: string; funding: string; budget: string; lead: string; period: string; summary: string; description?: string }
export interface Publication { id: number; year: number; text: string; impactFactor?: string; mnisw?: string; doi?: string; url?: string; scholarUrl?: string }
