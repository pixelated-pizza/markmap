<!DOCTYPE html>
<html lang="en" x-data="{ sidebarOpen: true }" xmlns:x-transition="http://www.w3.org/1999/xhtml">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MarkMap</title>

    <link rel="stylesheet" href="https://cdn.dhtmlx.com/gantt/edge/dhtmlxgantt.css">
    <script src="https://cdn.dhtmlx.com/gantt/edge/dhtmlxgantt.js"></script>


    <!-- Tailwind CDN -->
    <!-- <script src="https://cdn.tailwindcss.com"></script> -->

    <!-- Alpine.js CDN -->
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
     @vite('resources/css/app.css')
    @livewireStyles
</head>

<body class="flex h-screen bg-gray-100">

    <aside
        :class="sidebarOpen ? 'w-64' : 'w-16'"
        class="bg-gray-800 text-white flex-shrink-0 transition-all duration-300">
        <div class="p-4 flex items-center justify-between border-b border-gray-700">
            <span class="font-bold text-xl" x-show="sidebarOpen">MarkMap</span>
            <button @click="sidebarOpen = !sidebarOpen" class="focus:outline-none">
                <svg x-show="sidebarOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M6 18L18 6M6 6l12 12" />
                </svg>
                <svg x-show="!sidebarOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
        </div>
        <nav class="mt-4">
            <ul>
                <li x-data="{ open: false }" class="px-4 py-2 hover:bg-gray-700">
                    <button
                        @click="open = !open"
                        class="w-full flex justify-between items-center focus:outline-none"
                        x-show="sidebarOpen">
                        <span>Campaign Calendar</span>
                        <svg :class="{'rotate-90': open}" class="w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    <ul x-show="open" x-collapse class="pl-6 mt-2 space-y-1 text-sm">
                        <li class="px-2 py-1 hover:bg-gray-600"><a href="#" x-show="sidebarOpen">Weekly Calendar</a></li>
                        <li class="px-2 py-1 hover:bg-gray-600"><a href="#" x-show="sidebarOpen">Website Sale Details</a></li>
                        <li class="px-2 py-1 hover:bg-gray-600"><a href="#" x-show="sidebarOpen">Key Marketing Dates</a></li>
                    </ul>
                </li>
            </ul>
        </nav>

    </aside>

    <main :class="sidebarOpen ? 'ml-0' : 'ml-0'" class="flex-1 p-6 overflow-auto transition-all duration-300">
        <livewire:calendar />
    </main>

    @livewireScripts
    <script src="{{ asset('js/calendar.js') }}"></script>
</body>

</html>