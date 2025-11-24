import React from "react";

type LoaderProps = {
  label?: string;
  fullHeight?: boolean;
};

const Loader: React.FC<LoaderProps> = ({
  label = "Loading...",
  fullHeight = false,
}) => {
  return (
    <div
      className={`flex w-full items-center justify-center ${
        fullHeight ? "min-h-[220px]" : "py-6"
      }`}
    >
      <div className="flex items-center gap-3 text-gray-700 dark:text-gray-200">
        <span className="inline-block h-10 w-10 animate-spin rounded-full border-[3px] border-gray-200 border-t-gray-800 dark:border-gray-700 dark:border-t-white" />
        <span className="text-sm font-medium">{label}</span>
      </div>
    </div>
  );
};

export default Loader;
