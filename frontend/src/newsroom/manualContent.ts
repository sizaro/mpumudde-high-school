import type { NewsroomItem } from "./types";

const classroom = "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1400&q=82";
const science = "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1400&q=82";
const sports = "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1400&q=82";
const community = "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1400&q=82";
const library = "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1400&q=82";
const leadership = "https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=1400&q=82";

export const manualNewsroomContent: NewsroomItem[] = [
  {
    id: "story-001", slug: "learning-through-science-and-practical-discovery", type: "article", category: "academics", featured: true,
    title: "Learning Through Science and Practical Discovery", excerpt: "Learners strengthen classroom understanding by observing, testing ideas and explaining what they discover.",
    body: ["Practical learning gives students an opportunity to connect classroom ideas with observation and evidence.", "Through guided activities, learners practise careful thinking, teamwork, recording results and communicating what they have learned.", "The school continues to encourage approaches that make lessons active, purposeful and connected to everyday life."],
    image: science, imageAlt: "Students taking part in practical science learning", publishedAt: "2026-08-01T09:00:00+03:00", author: "Mpumudde Newsroom", readMinutes: 3, tags: ["Science", "Learning", "Academics"],
  },
  {
    id: "story-002", slug: "term-calendar-and-important-school-dates", type: "announcement", category: "announcements", priority: "important",
    title: "Term Calendar and Important School Dates", excerpt: "Families are encouraged to review the current term calendar and keep important academic and community dates available.",
    body: ["The school calendar brings together key academic dates, parent engagements, assessments and community activities.", "Parents and guardians should confirm individual activity details with the school administration whenever necessary.", "Any changes to the published programme will be communicated through official school channels."],
    image: classroom, imageAlt: "Learners in a classroom", publishedAt: "2026-07-30T11:20:00+03:00", author: "School Administration", readMinutes: 2, tags: ["Term Dates", "Parents", "Notice"],
  },
  {
    id: "story-003", slug: "inter-house-sports-and-team-participation", type: "event", category: "events",
    title: "Inter-House Sports and Team Participation", excerpt: "Students prepare to represent their houses through athletics, football, netball and team activities.",
    body: ["Inter-house activities give learners more opportunities to participate, develop confidence and contribute to their teams.", "Students are encouraged to demonstrate discipline, respect for officials and good sportsmanship throughout the programme.", "Families may contact the school for the confirmed programme and visitor arrangements."],
    image: sports, imageAlt: "Students participating in school sports", publishedAt: "2026-07-28T15:00:00+03:00", author: "Sports Department", readMinutes: 2, eventDate: "2026-08-15", eventTime: "8:00 AM", eventLocation: "School sports field", tags: ["Sports", "Houses", "Students"],
  },
  {
    id: "story-004", slug: "prefects-lead-through-service-and-example", type: "article", category: "student-life",
    title: "Prefects Lead Through Service and Example", excerpt: "Student leaders support communication, responsibility and a positive culture across the school.",
    body: ["Prefect leadership is an opportunity to learn responsibility through service.", "Student leaders work with staff and fellow learners to strengthen communication, participation and school routines.", "The role calls for fairness, respect, consistency and a willingness to listen."],
    image: leadership, imageAlt: "Students collaborating as a leadership team", publishedAt: "2026-07-25T10:15:00+03:00", author: "Student Affairs", readMinutes: 3, tags: ["Prefects", "Leadership", "Service"],
  },
  {
    id: "story-005", slug: "building-reading-habits-beyond-the-classroom", type: "article", category: "academics",
    title: "Building Reading Habits Beyond the Classroom", excerpt: "Regular reading helps learners expand vocabulary, strengthen concentration and explore ideas independently.",
    body: ["Reading is not limited to preparing for an examination. It helps learners develop language, curiosity and independent thought.", "Students are encouraged to make purposeful use of available reading materials and discuss what they learn.", "Families can support the same habit by setting aside time for reading at home."],
    image: library, imageAlt: "Bookshelves in a school library", publishedAt: "2026-07-22T13:10:00+03:00", author: "Academic Department", readMinutes: 3, tags: ["Reading", "Library", "Study"],
  },
  {
    id: "story-006", slug: "football-team-prepares-for-community-fixture", type: "article", category: "sports",
    title: "Football Team Prepares for Community Fixture", excerpt: "Training focuses on teamwork, fitness, discipline and representing the school responsibly.",
    body: ["The school football team continues its preparation through structured practice and teamwork.", "Coaches emphasise fitness, communication, respect and responsible conduct alongside performance.", "Confirmed fixture details will be published through the events section."],
    image: sports, imageAlt: "Football players training on a field", publishedAt: "2026-07-20T16:30:00+03:00", author: "Sports Department", readMinutes: 2, tags: ["Football", "Teamwork", "Sports"],
  },
  {
    id: "story-007", slug: "parents-and-school-working-together", type: "article", category: "community",
    title: "Parents and School Working Together", excerpt: "Consistent communication between families and the school strengthens learner support and accountability.",
    body: ["Learners benefit when the guidance they receive at school is reinforced at home.", "Parent engagement creates opportunities to discuss progress, wellbeing, attendance and future goals.", "The school welcomes constructive communication through the appropriate administration channels."],
    image: community, imageAlt: "Adults and learners participating in a community activity", publishedAt: "2026-07-18T09:45:00+03:00", author: "Community Relations", readMinutes: 3, tags: ["Parents", "Community", "Partnership"],
  },
  {
    id: "story-008", slug: "student-effort-recognised-across-school-life", type: "article", category: "achievements",
    title: "Student Effort Recognised Across School Life", excerpt: "Progress in academics, leadership, creativity and service deserves thoughtful recognition.",
    body: ["Achievement can appear through strong results, consistent improvement, responsible leadership or service to others.", "Recognising effort encourages learners to keep developing their abilities and habits.", "The school celebrates progress while reminding every student that growth remains an ongoing journey."],
    image: leadership, imageAlt: "Students celebrating a shared achievement", publishedAt: "2026-07-16T14:05:00+03:00", author: "Mpumudde Newsroom", readMinutes: 2, tags: ["Achievement", "Students", "Recognition"],
  },
  {
    id: "story-009", slug: "student-clubs-open-new-opportunities", type: "article", category: "student-life",
    title: "Student Clubs Open New Opportunities", excerpt: "Clubs allow learners to practise creativity, communication, collaboration and responsibility.",
    body: ["Co-curricular activities help students discover interests that may not appear during ordinary lessons.", "Through clubs, learners can practise speaking, creating, organising, serving and solving problems with others.", "Participation should complement academic responsibility and positive conduct."],
    image: classroom, imageAlt: "Students learning together in a group", publishedAt: "2026-07-14T12:00:00+03:00", author: "Student Affairs", readMinutes: 3, tags: ["Clubs", "Activities", "Student Life"],
  },
  {
    id: "story-010", slug: "visitor-access-and-student-safeguarding-reminder", type: "announcement", category: "updates", priority: "urgent",
    title: "Visitor Access and Student Safeguarding Reminder", excerpt: "All visitors should follow the school’s entry, identification and student-contact procedures.",
    body: ["Visitor controls form part of the school’s responsibility to protect learners and maintain an orderly environment.", "Visitors should report to the recognised entry point and follow directions from the security and administration teams.", "No visitor should remove a learner or enter restricted areas without proper authorisation."],
    image: classroom, imageAlt: "A secure and orderly school environment", publishedAt: "2026-07-12T08:30:00+03:00", author: "School Administration", readMinutes: 2, tags: ["Security", "Safeguarding", "Visitors"],
  },
  {
    id: "story-011", slug: "school-life-in-pictures", type: "media", category: "media",
    title: "School Life in Pictures", excerpt: "A visual collection highlighting learning, participation, leadership and school community moments.",
    body: ["This media collection brings together selected moments from school life.", "Approved school photographs and videos will replace the temporary editorial media as they become available."],
    image: leadership, imageAlt: "Students enjoying a school community activity", publishedAt: "2026-07-10T17:00:00+03:00", author: "Mpumudde Newsroom", readMinutes: 1, tags: ["Photos", "Video", "School Life"],
  },
  {
    id: "story-012", slug: "admissions-enquiries-and-school-visits", type: "announcement", category: "news", priority: "normal",
    title: "Admissions Enquiries and School Visits", excerpt: "Prospective families can contact the school for admission guidance and arrange an appropriate time to visit.",
    body: ["The admissions team can help families understand requirements, available programmes and the application process.", "Families planning to visit are encouraged to contact the school first so that the appropriate team can assist them.", "Official contact details are available on the school contact page."],
    image: community, imageAlt: "Family receiving education guidance", publishedAt: "2026-07-08T10:00:00+03:00", author: "Admissions Office", readMinutes: 2, tags: ["Admissions", "Visits", "Families"],
  },
];
