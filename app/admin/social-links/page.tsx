"use client";
import { ResourceManager } from "../ResourceManager";
export default function Page() {
  return (
    <ResourceManager
      title="Social Links"
      subtitle="Footer social media links"
      endpoint="/api/social-links"
      columns={["platform", "url", "status"]}
      fields={[
        { name: "platform", label: "Platform", required: true, placeholder: "LinkedIn" },
        { name: "url", label: "URL", type: "url", required: true },
        { name: "icon", label: "Icon key", placeholder: "linkedin" },
        { name: "sortOrder", label: "Sort order", type: "number" },
        { name: "status", label: "Status", type: "status" },
      ]}
    />
  );
}
