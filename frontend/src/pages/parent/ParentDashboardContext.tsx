import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import parentService, { type ParentDashboardResponse } from "../../services/parentService";

type ParentDashboardContextType = {
  data: ParentDashboardResponse | null;
  loading: boolean;
  error: string | null;
  selectedStudentId: string | null;
  selectStudent: (studentId: string) => Promise<void>;
  refresh: () => Promise<void>;
};

const ParentDashboardContext = createContext<ParentDashboardContextType | undefined>(undefined);

export function ParentDashboardProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ParentDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  const loadDashboard = async (studentId?: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await parentService.getDashboard(studentId);
      setData(result);
      setSelectedStudentId(studentId ?? result.children?.[0]?.studentId ?? null);
    } catch (err) {
      setError("Unable to load parent dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDashboard();
  }, []);

  const selectStudent = async (studentId: string) => {
    await loadDashboard(studentId);
  };

  const refresh = async () => {
    await loadDashboard(selectedStudentId ?? undefined);
  };

  return (
    <ParentDashboardContext.Provider
      value={{
        data,
        loading,
        error,
        selectedStudentId,
        selectStudent,
        refresh,
      }}
    >
      {children}
    </ParentDashboardContext.Provider>
  );
}

export function useParentDashboard() {
  const context = useContext(ParentDashboardContext);
  if (!context) {
    throw new Error("useParentDashboard must be used within a ParentDashboardProvider");
  }
  return context;
}
