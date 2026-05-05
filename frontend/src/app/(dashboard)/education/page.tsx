import { BookOpen, Play, Users, Clock, Star } from "lucide-react";

const learningPaths = [
  {
    title: "Halal Finance 101",
    level: "Beginner",
    lessons: 8,
    duration: "3 hours",
    description: "What makes investing halal, key prohibitions (riba, gharar, maysir), and how to get started.",
    progress: 62,
    color: "bg-green-50 border-green-100",
    badge: "bg-green-100 text-green-700",
  },
  {
    title: "Advanced Halal Investing",
    level: "Intermediate",
    lessons: 12,
    duration: "5 hours",
    description: "Deep dive into AAOIFI standards, screening methodologies, portfolio construction, and purification.",
    progress: 0,
    color: "bg-blue-50 border-blue-100",
    badge: "bg-blue-100 text-blue-700",
  },
  {
    title: "Islamic Estate Planning",
    level: "Advanced",
    lessons: 6,
    duration: "2.5 hours",
    description: "Faraid (Islamic inheritance law), wasiyyah, waqf, and integrating Islamic law with US estate planning.",
    progress: 0,
    color: "bg-purple-50 border-purple-100",
    badge: "bg-purple-100 text-purple-700",
  },
];

const upcomingWebinars = [
  {
    title: "Halal ETFs: Are They Actually Halal?",
    speaker: "Sheikh Dr. Yusuf DeLorenzo",
    date: "May 15, 2026",
    time: "7 PM EST",
    registrations: 284,
  },
  {
    title: "Building Wealth in Your 30s the Halal Way",
    speaker: "Omar Shaikh, CFA",
    date: "May 22, 2026",
    time: "8 PM EST",
    registrations: 156,
  },
];

const discussionThreads = [
  {
    title: "Is TSLA still compliant after latest financials?",
    replies: 34,
    views: 892,
    hot: true,
  },
  {
    title: "What to do with a 401k that only has conventional funds?",
    replies: 21,
    views: 541,
    hot: false,
  },
  {
    title: "Halal alternatives to VTSAX — comprehensive list",
    replies: 67,
    views: 2140,
    hot: true,
  },
];

export default function EducationPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Education & Community</h1>
        <p className="text-gray-500 mt-1">
          Learn halal finance from the ground up, watch scholar webinars, and engage with
          the community.
        </p>
      </div>

      {/* Learning paths */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-brand-600" />
          Learning Paths
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {learningPaths.map((path) => (
            <div key={path.title} className={`rounded-xl border p-5 ${path.color}`}>
              <div className="flex items-start justify-between mb-3">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${path.badge}`}>
                  {path.level}
                </span>
                {path.progress > 0 && (
                  <span className="text-xs text-gray-500">{path.progress}% complete</span>
                )}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{path.title}</h3>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">{path.description}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                <span className="flex items-center gap-1">
                  <Play className="h-3 w-3" /> {path.lessons} lessons
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {path.duration}
                </span>
              </div>
              {path.progress > 0 && (
                <div className="h-1.5 bg-white rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full bg-brand-500 rounded-full"
                    style={{ width: `${path.progress}%` }}
                  />
                </div>
              )}
              <button className="w-full text-center text-sm font-medium text-brand-700 hover:underline">
                {path.progress > 0 ? "Continue" : "Start path"} →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Webinars */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Star className="h-5 w-5 text-brand-600" />
          Upcoming Scholar Webinars
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upcomingWebinars.map((w) => (
            <div key={w.title} className="rounded-xl bg-white border border-gray-100 p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-1">{w.title}</h3>
              <p className="text-sm text-brand-600 font-medium">{w.speaker}</p>
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                <span>{w.date} · {w.time}</span>
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" /> {w.registrations} registered
                </span>
              </div>
              <button className="mt-4 w-full rounded-lg bg-brand-600 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors">
                Register (Premium)
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Community */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-brand-600" />
          Community Discussions
        </h2>
        <div className="rounded-xl bg-white border border-gray-100 shadow-sm divide-y divide-gray-50">
          {discussionThreads.map((t) => (
            <div key={t.title} className="p-5 flex items-center justify-between hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center gap-3">
                {t.hot && (
                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">Hot</span>
                )}
                <span className="font-medium text-gray-900">{t.title}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-400 flex-shrink-0 ml-4">
                <span>{t.replies} replies</span>
                <span>{t.views} views</span>
              </div>
            </div>
          ))}
          <div className="p-4 text-center">
            <button className="text-sm text-brand-600 hover:underline font-medium">
              View all discussions →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
