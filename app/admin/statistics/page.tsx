"use client";
import { ResourceManager } from "../ResourceManager";
export default function Page() {
  return (
    <ResourceManager
      title="Statistics"
      subtitle="Animated counters (e.g. 25+ Years)"
      endpoint="/api/statistics"
      columns={["title", "value", "suffix", "status"]}
      fields={[
        { name: "title", label: "Title", required: true, placeholder: "Years of Engineering" },
        { name: "value", label: "Value", required: true, placeholder: "25" },
        { name: "suffix", label: "Suffix", placeholder: "+" },
        { name: "sortOrder", label: "Sort order", type: "number" },
        { name: "status", label: "Status", type: "status" },
      ]}
    />
  );
}
