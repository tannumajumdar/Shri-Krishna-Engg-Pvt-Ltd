"use client";
import { ResourceManager } from "../ResourceManager";
export default function Page() {
  return (
    <ResourceManager
      title="Industries"
      subtitle="Sectors served, shown in the Industries section"
      endpoint="/api/industries"
      columns={["name", "status"]}
      fields={[
        { name: "name", label: "Name", required: true },
        { name: "slug", label: "Slug", placeholder: "auto from name if blank" },
        { name: "description", label: "Description", type: "textarea" },
        { name: "image", label: "Image", type: "image" },
        { name: "sortOrder", label: "Sort order", type: "number" },
        { name: "status", label: "Status", type: "status" },
      ]}
    />
  );
}
