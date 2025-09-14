"use client";

import { useQueryState } from "nuqs";
import * as React from "react";
import { type FlagConfig, flagConfig } from "@/config/flag";

type FilterFlag = FlagConfig["featureFlags"][number]["value"];

interface FeatureFlagsContextValue {
  filterFlag: FilterFlag;
  enableAdvancedFilter: boolean;
}

const FeatureFlagsContext =
  React.createContext<FeatureFlagsContextValue | null>(null);

export function useFeatureFlags() {
  const context = React.useContext(FeatureFlagsContext);
  if (!context) {
    throw new Error(
      "useFeatureFlags must be used within a FeatureFlagsProvider",
    );
  }
  return context;
}

interface FeatureFlagsProviderProps {
  children: React.ReactNode;
}

export function FeatureFlagsProvider({ children }: FeatureFlagsProviderProps) {
  const [filterFlag, setFilterFlag] = useQueryState<FilterFlag | null>(
    "filterFlag",
    {
      parse: (value) => {
        if (!value) return null;
        const validValues = flagConfig.featureFlags.map((flag) => flag.value);
        return validValues.includes(value as FilterFlag)
          ? (value as FilterFlag)
          : null;
      },
      serialize: (value) => value ?? "",
      defaultValue: null,
      clearOnDefault: true,
      shallow: false,
      eq: (a, b) => (!a && !b) || a === b,
    },
  );

  const onFilterFlagChange = React.useCallback(
    (value: FilterFlag) => {
      setFilterFlag(value);
    },
    [setFilterFlag],
  );

  const contextValue: FeatureFlagsContextValue = {
    filterFlag: "advancedFilters",
    enableAdvancedFilter: true
  }

  return (
    <FeatureFlagsContext.Provider value={contextValue}>
      <div className="w-full overflow-x-auto">
      </div>
      {children}
    </FeatureFlagsContext.Provider>
  );
}
