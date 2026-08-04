export type PublicNavigationItem = {
  label: string;
  to: string;
  end?: boolean;
  children?: Array<{ label: string; to: string }>;
};

export const publicNavigation: PublicNavigationItem[] = [
  { label: "Home", to: "/", end: true },
  { label: "About", to: "/about" },
  { label: "Academics", to: "/academics" },
  { label: "Admissions", to: "/admissions" },
  {
    label: "Newsroom",
    to: "/newsroom",
    children: [
      { label: "Latest News", to: "/newsroom/news" },
      { label: "Announcements", to: "/newsroom/announcements" },
      { label: "Events", to: "/newsroom/events" },
      { label: "Academics", to: "/newsroom/academics" },
      { label: "Student Life", to: "/newsroom/student-life" },
      { label: "Sports", to: "/newsroom/sports" },
      { label: "Media", to: "/newsroom/media" },
      { label: "Search Archive", to: "/newsroom/search" },
    ],
  },
  { label: "Gallery", to: "/gallery" },
  { label: "Contact", to: "/contact" },
];
