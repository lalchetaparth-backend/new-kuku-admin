import { createStatusSwitch } from "../data/shared";
import { apiRequest } from "../lib/api";

const EMPTY_VALUE = "-";
const ON_HOLD_LABEL = "On Hold";

const blogStatusOptions = [
  { value: "active", label: "Active", badgeClass: "text-bg-success" },
  { value: "inactive", label: ON_HOLD_LABEL, badgeClass: "status-badge-inactive" },
];

function formatValue(value) {
  if (value === null || value === undefined) {
    return EMPTY_VALUE;
  }

  const normalizedValue = String(value).trim();

  return normalizedValue || EMPTY_VALUE;
}

function formatDate(value) {
  if (!value) {
    return EMPTY_VALUE;
  }

  const normalizedValue = String(value).trim().replace(" ", "T");
  const parsedDate = new Date(normalizedValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return formatValue(value);
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

function normalizeStatus(status) {
  const normalizedStatus = String(status ?? "")
    .trim()
    .toLowerCase();

  if (normalizedStatus === "active" || normalizedStatus === "live") {
    return "active";
  }

  return "inactive";
}

function normalizeSubmitStatus(status) {
  const normalizedStatus = String(status ?? "")
    .trim()
    .toLowerCase();

  if (normalizedStatus === "inactive" || normalizedStatus === "hold") {
    return "Inactive";
  }

  return "Active";
}

function normalizeStatusMessage(response) {
  if (
    typeof response === "object" &&
    response !== null &&
    typeof response.msg === "string"
  ) {
    return {
      ...response,
      msg: response.msg.replace(/Inactive/g, ON_HOLD_LABEL),
    };
  }

  return response;
}

function formatFileName(value) {
  if (!value) {
    return EMPTY_VALUE;
  }

  const normalizedValue = String(value).trim().split("?")[0];
  const segments = normalizedValue.split("/").filter(Boolean);
  const fileName = segments[segments.length - 1];

  return formatValue(fileName || normalizedValue);
}

function formatBlogName(blog) {
  const candidateValues = [
    blog.meta_title,
    blog.description,
    blog.blog_subject,
  ];

  for (const candidateValue of candidateValues) {
    const formattedValue = formatValue(candidateValue);

    if (formattedValue !== EMPTY_VALUE) {
      return formattedValue;
    }
  }

  return formatFileName(blog.file);
}

function mapBlogToRow(blog, index) {
  return {
    id: index + 1,
    name: formatBlogName(blog),
    date: formatDate(blog.created_at),
    subject: formatValue(
      blog.blog_subject ?? blog.meta_description ?? blog.blog_content,
    ),
    status: createStatusSwitch(
      normalizeStatus(blog.status),
      blogStatusOptions,
      {
        activeValue: "active",
        interactive: true,
        showCurrentOnly: true,
      },
    ),
    blogId: blog.blog_id,
    file: blog.file,
  };
}

export async function getBlogRows() {
  const response = await apiRequest("/admin/getBlogs");
  const blogs = Array.isArray(response?.data?.data) ? response.data.data : [];

  return blogs.map(mapBlogToRow);
}

export async function addBlog(formData) {
  const payload = new FormData();
  const file = formData.get("file");

  [
    "meta_title",
    "meta_keywords",
    "meta_description",
    "description",
    "blog_subject",
    "blog_content",
  ].forEach((fieldName) => {
    payload.set(fieldName, String(formData.get(fieldName) ?? "").trim());
  });

  payload.set("status", normalizeSubmitStatus(formData.get("status")));

  if (file instanceof File && file.size > 0) {
    payload.set("file", file);
  }

  return apiRequest("/admin/addBlog", {
    method: "POST",
    body: payload,
  });
}

export async function updateBlogStatus(blogId, status) {
  const payload = new FormData();

  payload.set("blog_id", String(blogId));
  payload.set("status", normalizeSubmitStatus(status));

  const response = await apiRequest("/admin/updateBlogStatusOrDeleteBlog", {
    method: "POST",
    body: payload,
  });

  return normalizeStatusMessage(response);
}
