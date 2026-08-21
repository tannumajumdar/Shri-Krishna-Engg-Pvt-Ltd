"use client";
import { ResourceManager } from "../ResourceManager";

const SECTIONS = ["HERO","ABOUT","PRODUCTS","INDUSTRIES","INFRASTRUCTURE","QUALITY","CTA"]
  .map((s) => ({ value: s, label: s }));

export default function Page() {
  return (
    <ResourceManager
      title="Media"
      subtitle="Hero videos, section images and the infrastructure gallery"
      endpoint="/api/media"
      columns={["title", "type", "section", "status"]}
      fields={[
        { name: "type", label: "Type", type: "select", required: true,
          options: [{ value: "IMAGE", label: "Image" }, { value: "VIDEO", label: "Video" }] },
        { name: "section", label: "Section", type: "select", required: true, options: SECTIONS },
        { name: "title", label: "Title" },
        { name: "fileUrl", label: "File (image)", type: "image" },
        { name: "poster", label: "Poster (for video)", type: "image" },
        { name: "alt", label: "Alt text" },
        { name: "sortOrder", label: "Sort order", type: "number" },
        { name: "status", label: "Status", type: "status" },
      ]}
    />
  );
}
