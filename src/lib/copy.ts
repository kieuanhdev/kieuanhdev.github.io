import type { Localized } from "./types.ts";

export const copy = {
  skip: { vi: "Bỏ qua điều hướng", en: "Skip to content" },
  nav: [
    { id: "about", label: { vi: "Giới thiệu", en: "About" } },
    { id: "skills", label: { vi: "Kỹ năng", en: "Skills" } },
    { id: "projects", label: { vi: "Dự án", en: "Projects" } },
    { id: "github", label: { vi: "GitHub", en: "GitHub" } },
    { id: "contact", label: { vi: "Liên hệ", en: "Contact" } },
  ],
  seeProjects: { vi: "Xem dự án", en: "See projects" },
  githubCta: { vi: "GitHub", en: "GitHub" },
  contactCta: { vi: "Liên hệ", en: "Contact" },
  openMenu: { vi: "Mở menu", en: "Open menu" },
  closeMenu: { vi: "Đóng menu", en: "Close menu" },
  language: { vi: "Ngôn ngữ", en: "Language" },
  themeToDark: { vi: "Bật giao diện tối", en: "Switch to dark theme" },
  themeToLight: { vi: "Bật giao diện sáng", en: "Switch to light theme" },
  newTab: { vi: "(mở tab mới)", en: "(opens in a new tab)" },
  avatarAlt: { vi: "Ảnh đại diện GitHub của Nguyễn Kiều Anh", en: "GitHub avatar of Nguyễn Kiều Anh" },
  repos: { vi: "Kho công khai", en: "Public repos" },
  stars: { vi: "Sao", en: "Stars" },
  languages: { vi: "Ngôn ngữ", en: "Languages" },
  since: { vi: "Tham gia", en: "Joined" },
  followers: { vi: "Người theo dõi", en: "Followers" },
  following: { vi: "Đang theo dõi", en: "Following" },
  viewProfile: { vi: "Mở hồ sơ GitHub", en: "Open GitHub profile" },
  aboutIndex: { vi: "01", en: "01" },
  skillsIndex: { vi: "02", en: "02" },
  projectsIndex: { vi: "03", en: "03" },
  githubIndex: { vi: "04", en: "04" },
  contactIndex: { vi: "05", en: "05" },
  featured: { vi: "Dự án nổi bật", en: "Featured work" },
  featuredNote: {
    vi: "Vài kho mình muốn nêu trước. Ngôn ngữ, số sao và ngày đẩy lấy từ GitHub. Kho không còn công khai sẽ tự ẩn.",
    en: "A few repositories called out first. Language, stars, and push date come from GitHub. Anything no longer public drops off this list.",
  },
  featuredEmpty: {
    vi: "Chưa có kho nổi bật nào trong danh sách công khai.",
    en: "None of the featured repositories are public right now.",
  },
  allRepos: { vi: "Mọi kho công khai", en: "Every public repository" },
  searchLabel: { vi: "Tìm kho", en: "Search repositories" },
  searchPlaceholder: { vi: "Tìm theo tên hoặc mô tả", en: "Search by name or description" },
  sortLabel: { vi: "Sắp xếp", en: "Sort" },
  sortRecent: { vi: "Mới cập nhật", en: "Recently updated" },
  sortStars: { vi: "Nhiều sao", en: "Most stars" },
  allLanguages: { vi: "Tất cả", en: "All" },
  includeForks: { vi: "Hiện cả fork", en: "Include forks" },
  noDescription: { vi: "Chưa có mô tả trên GitHub.", en: "No description on GitHub yet." },
  source: { vi: "Mã nguồn", en: "Source" },
  website: { vi: "Trang web", en: "Website" },
  fork: { vi: "Fork", en: "Fork" },
  updated: { vi: "Đẩy", en: "Pushed" },
  more: { vi: "Xem thêm", en: "Show more" },
  less: { vi: "Thu gọn", en: "Show less" },
  noMatch: {
    vi: "Không có kho nào khớp bộ lọc này.",
    en: "No repositories match this filter.",
  },
  clear: { vi: "Xóa bộ lọc", en: "Clear filters" },
  showing: { vi: "kho", en: "repositories" },
  loadingRepos: { vi: "Đang tải kho từ GitHub…", en: "Loading repositories from GitHub…" },
  liveAt: {
    vi: "Đọc trực tiếp từ api.github.com lúc {time}.",
    en: "Read live from api.github.com at {time}.",
  },
  cachedAt: {
    vi: "Bản GitHub vừa lưu trên trình duyệt này ({time}).",
    en: "GitHub data saved in this browser ({time}).",
  },
  noticeRate: {
    vi: "GitHub đang giới hạn số lần gọi API. Trang dùng bản lưu ngày {date}, nên sao và mô tả có thể cũ hơn một chút.",
    en: "GitHub is rate-limiting requests. This page is using the snapshot from {date}, so stars and descriptions may be slightly out of date.",
  },
  noticeError: {
    vi: "Không gọi được GitHub vừa rồi. Trang dùng bản lưu ngày {date}.",
    en: "GitHub could not be reached just now. This page is using the snapshot from {date}.",
  },
  noticeForced: {
    vi: "Đang xem thử chế độ dự phòng (?github=fallback), bản lưu ngày {date}.",
    en: "Previewing fallback mode (?github=fallback), snapshot from {date}.",
  },
  noticeStale: {
    vi: "Không gọi lại được GitHub. Đang hiện bản đã lưu trên trình duyệt này.",
    en: "GitHub could not be reached again. Showing the copy saved in this browser.",
  },
  statsNote: {
    vi: "Sao và ngôn ngữ tính trên kho không phải fork.",
    en: "Stars and languages count original repositories, not forks.",
  },
  chartTitle: {
    vi: "Ngôn ngữ theo số kho",
    en: "Languages by repository count",
  },
  other: { vi: "Khác", en: "Other" },
  monthTitle: {
    vi: "Kho có lần đẩy gần nhất trong tháng",
    en: "Repositories whose latest push falls in the month",
  },
  monthNote: {
    vi: "12 tháng gần nhất, giờ UTC. Đây là lần đẩy mới nhất của từng kho, không phải biểu đồ contribution trên GitHub.",
    en: "Last 12 months, UTC. This is each repository’s latest push, not GitHub’s contribution graph.",
  },
  monthLabel: { vi: "Tháng {month}/{year}", en: "Month {month}/{year}" },
  activityEvents: { vi: "Hoạt động công khai gần đây", en: "Recent public activity" },
  activityRepos: { vi: "Kho vừa được đẩy", en: "Recently pushed repositories" },
  activityEventsNote: {
    vi: "Từ sự kiện công khai của GitHub.",
    en: "From GitHub’s public events.",
  },
  activityReposNote: {
    vi: "Sự kiện công khai không có hoặc không tải được, nên danh sách lấy từ ngày đẩy của từng kho.",
    en: "Public events were empty or unavailable, so this list uses each repository’s push date.",
  },
  placeholder: { vi: "Mẫu", en: "Placeholder" },
  footer: {
    vi: "Làm bằng Vite, React và Tailwind.",
    en: "Built with Vite, React, and Tailwind.",
  },
} satisfies Record<string, Localized | readonly { id: string; label: Localized }[]>;

export function fill(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? "");
}
