"use client";

import DashboardLayout from "@/components/DashboardLayout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { authFetch } from "@/lib/authFetch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  LineChart,
  Line,
  Cell,
  PieChart,
  Pie,
} from "recharts";

const VIDEO_TYPE_OPTIONS = [
  { value: "all-videos", label: "All videos" },
  { value: "published", label: "Published" },
  { value: "drafts", label: "Drafts" },
];

const DATE_RANGE_OPTIONS = [
  { value: "last-1-day", label: "Last 1 day" },
  { value: "last-7-days", label: "Last 7 days" },
  { value: "last-30-days", label: "Last 30 days" },
  { value: "last-90-days", label: "Last 90 days" },
];

const CHART_TYPES = [
  { value: "area", label: "Area Chart" },
  { value: "line", label: "Line Chart" },
  { value: "bar", label: "Bar Chart" },
];

const COLORS = {
  videoGenerated: "#ef4444",
  imageGenerated: "#f59e42",
  published: "#3b82f6",
  background: {
    card: "bg-storiq-card-bg",
    chart: "#1c1c24",
  },
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-storiq-card-bg border border-storiq-border rounded-lg p-4 shadow-lg">
        <p className="text-white font-semibold mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-white">{entry.name}:</span>
            <span className="font-semibold text-white ml-2">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Stats = () => {
  const [dateRange, setDateRange] = useState("last-30-days");
  const [chartType, setChartType] = useState("area");

  type Stat = {
    title: string;
    value: string | number;
    change: string;
    changeType: "positive" | "negative";
    comparison: string;
    icon?: string;
  };

  type TimeseriesPoint = {
    label: string;
    aiVideosGeneratedCount?: number;
    aiImagesGeneratedCount?: number;
    scriptGeneratedCount: number;
    publishedCount: number;
  };

  const [stats, setStats] = useState<Stat[]>([]);
  const [timeseries, setTimeseries] = useState<TimeseriesPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper to convert dateRange to startDate and endDate
  function getDateRangeParams(range: string) {
    const now = new Date();
    let startDate: Date | null = null;
    let endDate: Date | null = null;

    switch (range) {
      case "last-1-day":
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 1);
        endDate = now;
        break;
      case "last-7-days":
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 6);
        endDate = now;
        break;
      case "last-30-days":
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 29);
        endDate = now;
        break;
      case "last-90-days":
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 89);
        endDate = now;
        break;
      default:
        startDate = null;
        endDate = null;
    }
    // Always use full ISO string for backend compatibility
    return {
      startDate: startDate ? startDate.toISOString() : "",
      endDate: endDate ? endDate.toISOString() : "",
    };
  }

  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const { startDate, endDate } = getDateRangeParams(dateRange);
        const params = [];
        if (startDate) params.push(`startDate=${startDate}`);
        if (endDate) params.push(`endDate=${endDate}`);
        const query = params.length ? `?${params.join("&")}` : "";

        const [summaryRes, timeseriesRes] = await Promise.all([
          authFetch(`/api/stats/summary${query}`),
          authFetch(`/api/stats/timeseries${query}`),
        ]);

        if (!summaryRes.ok || !timeseriesRes.ok) {
          throw new Error("Failed to fetch stats");
        }

        const [summaryData, timeseriesData] = await Promise.all([
          summaryRes.json(),
          timeseriesRes.json(),
        ]);

        if (!ignore) {
          setStats(summaryData.stats || []);
          setTimeseries(timeseriesData.data || []);
        }
      } catch (e) {
        if (!ignore)
          setError(e instanceof Error ? e.message : "Error loading stats");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    fetchData();
    return () => {
      ignore = true;
    };
  }, [dateRange]);

  // Calculate total metrics for pie chart
  const totalMetrics = timeseries.reduce(
    (acc, point) => ({
      videoGenerated: acc.videoGenerated + (point.aiVideosGeneratedCount || 0),
      imageGenerated: acc.imageGenerated + (point.aiImagesGeneratedCount || 0),
      published: acc.published + point.publishedCount,
    }),
    { videoGenerated: 0, imageGenerated: 0, published: 0 }
  );

  const pieData = [
    {
      name: "Videos Generated",
      value: totalMetrics.videoGenerated,
      color: COLORS.videoGenerated,
    },
    {
      name: "Images Generated",
      value: totalMetrics.imageGenerated,
      color: COLORS.imageGenerated,
    },
    {
      name: "Published",
      value: totalMetrics.published,
      color: COLORS.published,
    },
  ].filter((item) => item.value > 0);

  const renderChart = () => {
    const isMobile = window.innerWidth < 768;
    const chartMargin = isMobile
      ? { top: 10, right: 10, left: 0, bottom: 5 }
      : { top: 20, right: 30, left: 20, bottom: 5 };

    if (chartType === "line") {
      return (
        <LineChart data={timeseries} margin={chartMargin}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis
            dataKey="label"
            tick={{ fill: "#9CA3AF", fontSize: isMobile ? 10 : 12 }}
            axisLine={false}
            angle={isMobile ? -45 : 0}
            textAnchor={isMobile ? "end" : "middle"}
            height={isMobile ? 60 : 30}
          />
          <YAxis
            tick={{ fill: "#9CA3AF", fontSize: isMobile ? 10 : 12 }}
            axisLine={false}
            width={isMobile ? 30 : 60}
          />
          <Tooltip content={<CustomTooltip />} />
          {!isMobile && <Legend />}
          <Line
            type="monotone"
            dataKey="aiVideosGeneratedCount"
            name="Videos Generated"
            stroke={COLORS.videoGenerated}
            strokeWidth={isMobile ? 2 : 3}
            dot={{ fill: COLORS.videoGenerated, r: isMobile ? 3 : 4 }}
            activeDot={{ r: isMobile ? 5 : 6 }}
          />
          <Line
            type="monotone"
            dataKey="aiImagesGeneratedCount"
            name="Images Generated"
            stroke={COLORS.imageGenerated}
            strokeWidth={isMobile ? 2 : 3}
            dot={{ fill: COLORS.imageGenerated, r: isMobile ? 3 : 4 }}
            activeDot={{ r: isMobile ? 5 : 6 }}
          />
          <Line
            type="monotone"
            dataKey="publishedCount"
            name="Published"
            stroke={COLORS.published}
            strokeWidth={isMobile ? 2 : 3}
            dot={{ fill: COLORS.published, r: isMobile ? 3 : 4 }}
            activeDot={{ r: isMobile ? 5 : 6 }}
          />
        </LineChart>
      );
    }

    if (chartType === "bar") {
      return (
        <BarChart data={timeseries} margin={chartMargin}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis
            dataKey="label"
            tick={{ fill: "#9CA3AF", fontSize: isMobile ? 10 : 12 }}
            axisLine={false}
            angle={isMobile ? -45 : 0}
            textAnchor={isMobile ? "end" : "middle"}
            height={isMobile ? 60 : 30}
          />
          <YAxis
            tick={{ fill: "#9CA3AF", fontSize: isMobile ? 10 : 12 }}
            axisLine={false}
            width={isMobile ? 30 : 60}
          />
          <Tooltip content={<CustomTooltip />} />
          {!isMobile && <Legend />}
          <Bar
            dataKey="aiVideosGeneratedCount"
            name="Videos Generated"
            fill={COLORS.videoGenerated}
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="aiImagesGeneratedCount"
            name="Images Generated"
            fill={COLORS.imageGenerated}
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="publishedCount"
            name="Published"
            fill={COLORS.published}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      );
    }

    // Default area chart
    return (
      <AreaChart data={timeseries} margin={chartMargin}>
        <defs>
          <linearGradient id="colorVideoGenerated" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor={COLORS.videoGenerated}
              stopOpacity={0.3}
            />
            <stop
              offset="95%"
              stopColor={COLORS.videoGenerated}
              stopOpacity={0}
            />
          </linearGradient>
          <linearGradient id="colorImageGenerated" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor={COLORS.imageGenerated}
              stopOpacity={0.3}
            />
            <stop
              offset="95%"
              stopColor={COLORS.imageGenerated}
              stopOpacity={0}
            />
          </linearGradient>
          <linearGradient id="colorPublished" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={COLORS.published} stopOpacity={0.3} />
            <stop offset="95%" stopColor={COLORS.published} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
        <XAxis
          dataKey="label"
          tick={{ fill: "#9CA3AF", fontSize: isMobile ? 10 : 12 }}
          axisLine={false}
          angle={isMobile ? -45 : 0}
          textAnchor={isMobile ? "end" : "middle"}
          height={isMobile ? 60 : 30}
        />
        <YAxis
          tick={{ fill: "#9CA3AF", fontSize: isMobile ? 10 : 12 }}
          axisLine={false}
          width={isMobile ? 30 : 60}
        />
        <Tooltip content={<CustomTooltip />} />
        {!isMobile && <Legend />}
        <Area
          type="monotone"
          dataKey="aiVideosGeneratedCount"
          name="Videos Generated"
          stroke={COLORS.videoGenerated}
          fill="url(#colorVideoGenerated)"
          strokeWidth={isMobile ? 1.5 : 2}
        />
        <Area
          type="monotone"
          dataKey="aiImagesGeneratedCount"
          name="Images Generated"
          stroke={COLORS.imageGenerated}
          fill="url(#colorImageGenerated)"
          strokeWidth={isMobile ? 1.5 : 2}
        />
        <Area
          type="monotone"
          dataKey="publishedCount"
          name="Published"
          stroke={COLORS.published}
          fill="url(#colorPublished)"
          strokeWidth={isMobile ? 1.5 : 2}
        />
      </AreaChart>
    );
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
            Performance Stats
          </h1>
          <p className="text-white/60 text-sm md:text-base">
            Your posts activity from the last 30 days.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mb-6 md:mb-8">
          <Select defaultValue="all-videos">
            <SelectTrigger className="w-full sm:w-48 bg-storiq-card-bg border-storiq-border text-white">
              <SelectValue placeholder="All videos" />
            </SelectTrigger>
            <SelectContent className="bg-storiq-card-bg border-storiq-border">
              <SelectItem
                value="all-videos"
                className="text-white hover:bg-storiq-purple/20"
              >
                All videos
              </SelectItem>
              <SelectItem
                value="published"
                className="text-white hover:bg-storiq-purple/20"
              >
                Published
              </SelectItem>
              <SelectItem
                value="drafts"
                className="text-white hover:bg-storiq-purple/20"
              >
                Drafts
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-full sm:w-48 bg-storiq-card-bg border-storiq-border text-white">
              <SelectValue placeholder="Select days" />
            </SelectTrigger>
            <SelectContent className="bg-storiq-card-bg border-storiq-border">
              {DATE_RANGE_OPTIONS.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="text-white hover:bg-storiq-purple/20"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-storiq-card-bg border border-storiq-border rounded-xl md:rounded-2xl p-4 md:p-6 animate-pulse"
              >
                <div className="space-y-3">
                  <Skeleton className="h-3 md:h-4 w-24 bg-gray-700/50 mb-2" />
                  <Skeleton className="h-8 md:h-10 w-16 bg-gray-700/70" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-12 bg-green-500/20 rounded-full" />
                    <Skeleton className="h-3 w-20 bg-gray-700/30" />
                  </div>
                </div>
              </div>
            ))
          ) : error ? (
            <div className="col-span-2 lg:col-span-4 bg-storiq-card-bg border border-storiq-border rounded-xl md:rounded-2xl p-4 md:p-6 text-center">
              <span className="text-red-400 text-sm md:text-base">
                Error: {error}
              </span>
            </div>
          ) : stats.length === 0 ? (
            <div className="col-span-2 lg:col-span-4 bg-storiq-card-bg border border-storiq-border rounded-xl md:rounded-2xl p-4 md:p-6 text-center">
              <span className="text-white/60 text-sm md:text-base">
                No statistics available for the selected filters.
              </span>
            </div>
          ) : (
            <>
              {(() => {
                // Remove duplicate "Videos Published to Instagram" cards
                const seenTitles = new Set<string>();
                return stats
                  .filter((stat) => stat.title !== "Scripts Generated")
                  .filter((stat) => {
                    if (stat.title === "Videos Published to Instagram") {
                      if (seenTitles.has(stat.title)) return false;
                      seenTitles.add(stat.title);
                      return true;
                    }
                    return true;
                  })
                  .slice(0, 4)
                  .map((stat, index) => (
                    <div
                      key={index}
                      className="bg-storiq-card-bg border border-storiq-border rounded-xl md:rounded-2xl p-4 md:p-6"
                    >
                      <h3 className="text-white/60 text-xs md:text-sm mb-1 md:mb-2">
                        {stat.title}
                      </h3>
                      <div className="text-xl md:text-3xl font-bold text-white mb-1 md:mb-2">
                        {stat.value}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-xs md:text-sm font-semibold px-1.5 md:px-2 py-0.5 md:py-1 rounded ${
                            stat.changeType === "positive"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {stat.change}
                        </span>
                        <span className="text-white/50 text-xs md:text-sm truncate">
                          {stat.comparison}
                        </span>
                      </div>
                    </div>
                  ));
              })()}

              {/* Fifth card with special styling if it exists and is not a duplicate */}
              {stats.length > 4 &&
                stats[4].title !== "Scripts Generated" &&
                stats[4].title !== "Videos Published to Instagram" && (
                  <div className="bg-storiq-card-bg border border-storiq-border rounded-xl md:rounded-2xl p-4 md:p-6">
                    <h3 className="text-white/60 text-xs md:text-sm mb-1 md:mb-2">
                      {stats[4].title}
                    </h3>
                    <div className="text-xl md:text-3xl font-bold text-white mb-1 md:mb-2">
                      {stats[4].value}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-xs md:text-sm font-semibold px-1.5 md:px-2 py-0.5 md:py-1 rounded ${
                          stats[4].changeType === "positive"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {stats[4].change}
                      </span>
                      <span className="text-white/50 text-xs md:text-sm truncate">
                        {stats[4].comparison}
                      </span>
                    </div>
                  </div>
                )}
            </>
          )}
        </div>

        {/* Chart */}
        <div className="bg-storiq-card-bg border border-storiq-border rounded-xl md:rounded-2xl p-4 md:p-6">
          <h3 className="text-white text-lg md:text-xl font-bold mb-4 md:mb-6">
            Overall Statistics
          </h3>
          {loading ? (
            <div className="space-y-4 animate-pulse">
              {/* Chart Area Skeleton */}
              <div className="h-64 md:h-80 bg-gradient-to-br from-gray-700/30 to-gray-800/30 rounded-xl relative overflow-hidden">
                {/* Animated bars */}
                <div className="absolute bottom-0 left-0 right-0 flex items-end justify-around px-8 pb-8 gap-2">
                  {[40, 65, 45, 70, 55, 80, 60].map((height, i) => (
                    <div
                      key={i}
                      className="bg-gray-600/40 rounded-t"
                      style={{
                        height: `${height}%`,
                        width: "12%",
                        animationDelay: `${i * 0.1}s`,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Legend Skeleton */}
              <div className="flex flex-wrap justify-center gap-3 md:gap-6 mt-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <Skeleton className="w-3 h-3 rounded-full bg-gray-700/50" />
                    <Skeleton className="h-3 w-24 bg-gray-700/30" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="h-64 md:h-80 relative pr-2 md:pr-4 pb-4 md:pb-8 overflow-x-auto">
                <ResponsiveContainer width="100%" height="100%">
                  {renderChart()}
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-3 md:gap-6 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full"></div>
                  <span className="text-white/60 text-xs md:text-sm">
                    Video Generated
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-white/60 text-xs md:text-sm">
                    Video Download
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Stats;
