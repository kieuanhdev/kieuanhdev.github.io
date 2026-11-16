/**
 * Nội dung cá nhân của portfolio.
 * Sửa file này để đổi tên, giới thiệu, kỹ năng, dự án nổi bật và liên hệ.
 * Nhãn giao diện (menu, nút, thông báo) nằm ở src/lib/copy.ts.
 */
import type { Localized } from "../lib/types.ts";

export type FeaturedRepo = {
  repo: string;
  summary: Localized;
};

export type ContactLink = {
  id: string;
  label: string;
  href: string;
  /** true = link mẫu, hiện huy hiệu "Mẫu" cho đến khi bạn thay href thật. */
  placeholder: boolean;
};

export const site = {
  name: "Nguyễn Kiều Anh",
  nameLines: ["Nguyễn", "Kiều Anh"],
  role: {
    vi: "Lập trình viên fullstack",
    en: "Fullstack developer",
  },
  githubUser: "kieuanhdev",
  githubUrl: "https://github.com/kieuanhdev",
  avatarUrl: "https://avatars.githubusercontent.com/u/137601118?v=4",
  intro: {
    vi: "Mình là lập trình viên fullstack. Sản phẩm đi từ giao diện đến API, với Flutter, Next.js/TypeScript và Spring Boot.",
    en: "I’m a fullstack developer. Products run from the interface to the API, with Flutter, Next.js/TypeScript, and Spring Boot.",
  },
  about: [
    {
      vi: "Mình tham gia GitHub từ tháng 6 năm 2023. Phần lớn việc gần đây là app Flutter, web Next.js và API Spring Boot — thường tách giao diện và backend thành hai kho để mỗi bên chạy riêng.",
      en: "I’ve been on GitHub since June 2023. Recent work is mostly Flutter apps, Next.js sites, and Spring Boot APIs — usually split so the interface and the backend can run on their own.",
    },
    {
      vi: "Kho công khai hiện có cụm thương mại điện tử (Flutter, Next.js, Spring Boot), English Me, Trạm Truyện, bot cho team làm việc trên Jira, và một plugin nghiên cứu viết bằng Python. Mình thích thứ chạy được: giao diện rõ, API tách riêng, và README để tháng sau vẫn mở lại được.",
      en: "The public repositories include an e-commerce set (Flutter, Next.js, Spring Boot), English Me, Trạm Truyện, a TypeScript bot for a team working on Jira, and a Python research plugin. I like things that actually run: a clear interface, a separate API, and a README I can reopen next month.",
    },
  ],
  facts: [
    {
      vi: "Stack chính: Flutter, Next.js/TypeScript và Spring Boot.",
      en: "Main stack: Flutter, Next.js/TypeScript, and Spring Boot.",
    },
    {
      vi: "GitHub mở từ tháng 6 năm 2023.",
      en: "GitHub account opened in June 2023.",
    },
    {
      vi: "Số kho và số sao trên trang lấy từ API công khai, nên tự cập nhật khi repo đổi trạng thái.",
      en: "Repo and star counts on this page come from the public API, so they follow whatever is public.",
    },
  ],
  timeline: [
    {
      year: "2023",
      text: {
        vi: "Mở GitHub. Thử Python với trợ lý ảo TroLyAo-Genius.",
        en: "Opened GitHub. Tried Python with the TroLyAo-Genius assistant.",
      },
    },
    {
      year: "2024",
      text: {
        vi: "Bắt đầu Java và Spring, rồi các web app phía server.",
        en: "Started Java and Spring, then server-side web apps.",
      },
    },
    {
      year: "2025",
      text: {
        vi: "Spring Boot cho thương mại điện tử, Flutter với Firebase, và app đọc ebook.",
        en: "Spring Boot for e-commerce, Flutter with Firebase, and an ebook reader app.",
      },
    },
    {
      year: "2026",
      text: {
        vi: "English Me (Flutter và Spring Boot), Trạm Truyện (Next.js và Spring Boot), bot Jira bằng TypeScript.",
        en: "English Me (Flutter and Spring Boot), Trạm Truyện (Next.js and Spring Boot), and a TypeScript Jira bot.",
      },
    },
  ],
  skills: [
    {
      group: { vi: "Di động", en: "Mobile" },
      items: ["Flutter", "Dart", "Firebase"],
    },
    {
      group: { vi: "Web", en: "Web" },
      items: ["Next.js", "TypeScript", "React", "HTML", "CSS"],
    },
    {
      group: { vi: "Backend", en: "Backend" },
      items: ["Java", "Spring Boot"],
    },
    {
      group: { vi: "Khác", en: "Other" },
      items: ["Python", "Git", "GitHub"],
    },
  ],
  skillNote: {
    vi: "Liệt kê theo những gì thực sự có trong kho công khai — không phải danh sách chứng chỉ.",
    en: "Listed from what actually shows up in the public repositories — not a certificate checklist.",
  },
  featured: [
    {
      repo: "e-commerce",
      summary: {
        vi: "App Flutter dùng Firebase Auth và Firestore. Cùng hệ có e-commerce-fontend (Next.js) và e-commerce-backend (Spring Boot).",
        en: "A Flutter app using Firebase Auth and Firestore. The same system has e-commerce-fontend (Next.js) and e-commerce-backend (Spring Boot).",
      },
    },
    {
      repo: "e-commerce-fontend",
      summary: {
        vi: "Giao diện thương mại điện tử viết bằng Next.js 16 và TypeScript, nối với API Spring Boot ở e-commerce-backend.",
        en: "An e-commerce interface in Next.js 16 and TypeScript, paired with the Spring Boot API in e-commerce-backend.",
      },
    },
    {
      repo: "english_me_fontend",
      summary: {
        vi: "App Flutter cho English Me. API đi kèm là english_me_backend, Spring Boot 3.",
        en: "The Flutter app for English Me. The companion API is english_me_backend, Spring Boot 3.",
      },
    },
    {
      repo: "tramtruyenweb",
      summary: {
        vi: "Web Next.js 16 cho Trạm Truyện. API là TramTruyenAPI, Spring Boot 3.",
        en: "A Next.js 16 site for Trạm Truyện. The API is TramTruyenAPI, Spring Boot 3.",
      },
    },
    {
      repo: "bot-jira",
      summary: {
        vi: "Web nội bộ để team thao tác trên Jira: board, automation, release gate và thông báo. Jira vẫn là nguồn dữ liệu. Viết bằng TypeScript.",
        en: "An internal web app for working on top of Jira: board, automation, release gate, and notifications. Jira stays the source of truth. Written in TypeScript.",
      },
    },
    {
      repo: "ebook-reader",
      summary: {
        vi: "App đọc ebook viết bằng Flutter.",
        en: "An ebook reader written in Flutter.",
      },
    },
  ] satisfies FeaturedRepo[],
  contacts: [
    {
      id: "github",
      label: "GitHub",
      href: "https://github.com/kieuanhdev",
      placeholder: false,
    },
    {
      id: "email",
      label: "Email",
      href: "mailto:you@example.com",
      placeholder: true,
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/your-profile",
      placeholder: true,
    },
    {
      id: "facebook",
      label: "Facebook",
      href: "https://facebook.com/your-profile",
      placeholder: true,
    },
  ] satisfies ContactLink[],
  contactLead: {
    vi: "Muốn xem mã nguồn hoặc bàn một sản phẩm, GitHub là chỗ đang dùng thật. Email và mạng xã hội bên dưới đang để mẫu, sửa trong file này.",
    en: "For source code or a product conversation, GitHub is the link that is real today. The email and social rows below are placeholders — edit them in this file.",
  },
  contactNote: {
    vi: "Đổi href, rồi đặt placeholder: false khi link đã là của bạn.",
    en: "Change href, then set placeholder: false once the link is yours.",
  },
} as const;
