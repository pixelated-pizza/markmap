<template>
  <div
    class="apex-wrapper mt-5 rounded-2xl p-5 shadow-xl 
           bg-white app-dark:bg-[#000524] 
           border border-gray-200 app-dark:border-gray-700"
  >
    <apexchart type="bar" height="300" :options="chartOptions" :series="series" />
  </div>
</template>


<script setup>
import { computed } from "vue";

const props = defineProps({
  campaigns: {
    type: Array,
    required: true
  }
});

function buildCompletedCampaignCount(campaigns) {
  const map = {};

  campaigns.forEach((c, index) => {
    if (!c.end_date) return;

    const end = new Date(c.end_date);
    const monthKey = `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, "0")}`;

    if (!map[monthKey]) {
      map[monthKey] = { campaigns: {} };
    }

    const name = c.name || `Campaign ${c.id ?? index}`;
    const channelName =
      typeof c.channel === "string"
        ? c.channel
        : c.channel?.name || "Unknown";

    if (!map[monthKey].campaigns[name]) {
      map[monthKey].campaigns[name] = new Set();
    }

    map[monthKey].campaigns[name].add(channelName);
  });

  return Object.entries(map)
    .sort(([a], [b]) => new Date(a + "-01") - new Date(b + "-01"))
    .map(([month, { campaigns }]) => {
      const campaignList = Object.entries(campaigns).map(
        ([name, channels]) => {
          const channelStr = Array.from(channels).join(" & ");
          return channels.size > 1 ? `${name} - ${channelStr}` : name;
        }
      );

      return {
        x: new Date(month + "-01").toLocaleString("default", {
          month: "short",
          year: "numeric"
        }),
        y: Object.keys(campaigns).length, // ✅ UNIQUE COUNT
        campaigns: campaignList
      };
    });
}


const series = computed(() => [
  {
    name: "Completed Campaigns",
    data: buildCompletedCampaignCount(props.campaigns)
  }
]);

const isDark = computed(() =>
  document.documentElement.classList.contains("app-dark")
);

const chartOptions = computed(() => ({
  chart: {
    type: "bar",
    foreColor: isDark.value ? "#e5e7eb" : "#111827", // gray-200 vs gray-900
    toolbar: { show: false },
    zoom: { enabled: true }
  },

  title: {
    text: "Website Sales / Promotions Completed Per Month",
    align: "center",
    style: {
      fontSize: "16px",
      fontWeight: "600",
      color: isDark.value ? "#ffffff" : "#111827"
    }
  },

  plotOptions: {
    bar: {
      borderRadius: 6,
      horizontal: false,
      columnWidth: "50%"
    }
  },

  dataLabels: { enabled: false },

  // Keep your brand color for bars (works in both modes)
  colors: ["#00BAEC"],

  xaxis: {
    type: "category",
    title: { text: "Month" }
  },

  yaxis: {
    min: 0,
    title: { text: "Completed Campaigns" }
  },

  tooltip: {
    enabled: true,
    shared: false,
    followCursor: true,
    custom: ({ series, seriesIndex, dataPointIndex, w }) => {
      const dp = w.config.series[seriesIndex].data[dataPointIndex];
      const campaignList = dp.campaigns
        .map(name => `<li>${name}</li>`)
        .join("");

      return `
        <div style="
          padding: 8px;
          color: ${isDark.value ? "#fff" : "#111827"};
          background: ${isDark.value ? "#1f2937" : "#f3f4f6"};
          border-radius: 6px;
          font-size: 13px;
          border: 1px solid ${isDark.value ? "#374151" : "#e5e7eb"};
        ">
          <strong>Count: ${dp.y}</strong>
          <ul style="margin: 5px 0 0 15px; padding: 0; list-style-type: disc;">
            ${campaignList}
          </ul>
        </div>
      `;
    }
  },

  grid: {
    borderColor: isDark.value ? "#374151" : "#e5e7eb"
  }
}));
</script>

<style scoped>
.apex-wrapper {
  background: #000524;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 22px 35px -16px rgba(0, 0, 0, 0.7);
}
</style>
