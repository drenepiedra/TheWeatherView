// =========================
// LISTA DE PAÍSES
// =========================
const countries = [
    { name: "Afganistán", code: "af", lat: 33.0, lon: 65.0 },
    { name: "Albania", code: "al", lat: 41.0, lon: 20.0 },
    { name: "Alemania", code: "de", lat: 51.0, lon: 10.0 },
    { name: "Andorra", code: "ad", lat: 42.5, lon: 1.5 },
    { name: "Angola", code: "ao", lat: -12.5, lon: 18.5 },
    { name: "Argentina", code: "ar", lat: -34.0, lon: -64.0 },
    { name: "Australia", code: "au", lat: -25.0, lon: 133.0 },
    { name: "Austria", code: "at", lat: 47.333, lon: 13.333 },
    { name: "Bangladesh", code: "bd", lat: 24.0, lon: 90.0 },
    { name: "Bélgica", code: "be", lat: 50.833, lon: 4.0 },
    { name: "Brasil", code: "br", lat: -10.0, lon: -55.0 },
    { name: "Canadá", code: "ca", lat: 60.0, lon: -95.0 },
    { name: "Chile", code: "cl", lat: -30.0, lon: -71.0 },
    { name: "China", code: "cn", lat: 35.0, lon: 105.0 },
    { name: "Colombia", code: "co", lat: 4.0, lon: -72.0 },
    { name: "Corea del Sur", code: "kr", lat: 36.0, lon: 128.0 },
    { name: "Cuba", code: "cu", lat: 21.5, lon: -80.0 },
    { name: "Dinamarca", code: "dk", lat: 56.0, lon: 10.0 },
    { name: "Egipto", code: "eg", lat: 27.0, lon: 30.0 },
    { name: "España", code: "es", lat: 40.0, lon: -4.0 },
    { name: "Estados Unidos", code: "us", lat: 38.0, lon: -97.0 },
    { name: "Francia", code: "fr", lat: 46.0, lon: 2.0 },
    { name: "Grecia", code: "gr", lat: 39.0, lon: 22.0 },
    { name: "India", code: "in", lat: 20.0, lon: 77.0 },
    { name: "Indonesia", code: "id", lat: -5.0, lon: 120.0 },
    { name: "Irlanda", code: "ie", lat: 53.0, lon: -8.0 },
    { name: "Italia", code: "it", lat: 42.833, lon: 12.833 },
    { name: "Japón", code: "jp", lat: 36.0, lon: 138.0 },
    { name: "México", code: "mx", lat: 23.0, lon: -102.0 },
    { name: "Noruega", code: "no", lat: 62.0, lon: 10.0 },
    { name: "Países Bajos", code: "nl", lat: 52.0, lon: 5.0 },
    { name: "Perú", code: "pe", lat: -10.0, lon: -76.0 },
    { name: "Portugal", code: "pt", lat: 39.5, lon: -8.0 },
    { name: "Reino Unido", code: "gb", lat: 54.0, lon: -2.0 },
    { name: "Rusia", code: "ru", lat: 60.0, lon: 90.0 },
    { name: "Sudáfrica", code: "za", lat: -29.0, lon: 24.0 },
    { name: "Suecia", code: "se", lat: 62.0, lon: 15.0 },
    { name: "Suiza", code: "ch", lat: 47.0, lon: 8.0 },
    { name: "Turquía", code: "tr", lat: 39.0, lon: 35.0 },
    { name: "Ucrania", code: "ua", lat: 49.0, lon: 32.0 },
    { name: "Vietnam", code: "vn", lat: 16.0, lon: 106.0 }
];

// =========================
// ELEMENTOS HTML
// =========================
const weatherContainer = document.getElementById("weatherContainer");
const loadingState = document.getElementById("loadingState");
const errorState = document.getElementById("errorState");
const searchInput = document.getElementById("searchInput");
const searchInfo = document.getElementById("searchInfo");
const searchResultText = document.getElementById("searchResultText");
const clearSearch = document.getElementById("clearSearch");

// =========================
// GET WEATHER
// =========================
async function getWeather(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        console.log(data)


        return data.current_weather || null;

    } catch {
        return null;
    }
}

// =========================
// ICONO + ESTADO
// =========================
function getWeatherIcon(weather) {
    if (!weather) return { icon: "❓", state: "gray", label: "Desconocido" };

    let { weathercode } = weather;

    if ([0].includes(weathercode))
        return { icon: "☀️", state: "green", label: "Soleado" };

    if ([1, 2].includes(weathercode))
        return { icon: "⛅", state: "yellow", label: "Parcialmente nublado" };

    if ([3].includes(weathercode))
        return { icon: "☁️", state: "yellow", label: "Nublado" };

    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(weathercode))
        return { icon: "🌧️", state: "red", label: "Lluvioso" };

    return { icon: "❓", state: "gray", label: "Desconocido" };
}

// =========================
// ESTADO ANIMADO
// =========================
function statusDot(color) {
    const colors = {
        green: "bg-green-500",
        red: "bg-red-500",
        yellow: "bg-yellow-400",
        gray: "bg-gray-400"
    };

    return `
        <span class="inline-block w-3 h-3 ${colors[color]} rounded-full animate-pulse shadow-md"></span>
    `;
}

// =========================
// TABLA
// =========================
async function loadWeatherTable(list = countries) {
    try {
        errorState.classList.add("hidden");
        loadingState.classList.remove("hidden");
        weatherContainer.innerHTML = "";

        let html = `
            <div class="flex justify-center">
                <table class="w-full max-w-xl bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
                    <thead class="bg-gray-100 dark:bg-gray-700">
                        <tr class="text-gray-700 dark:text-gray-200 text-sm">
                            <th class="p-3 text-center">Estado</th>
                            <th class="p-3 text-center">País</th>
                            <th class="p-3 text-center">Clima</th>
                        </tr>
                    </thead>
                    <tbody id="weatherTable">
        `;

        for (const c of list) {
            const weather = await getWeather(c.lat, c.lon);
            const wInfo = getWeatherIcon(weather);

            html += `
                <tr class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    
                    <!-- ESTADO -->
                    <td class="p-3 text-center">
                        ${statusDot(wInfo.state)}
                    </td>

                    <!-- PAÍS -->
                    <td class="p-3 text-center">
                        <div class="flex justify-center items-center gap-3">
                            <img src="https://flagcdn.com/48x36/${c.code}.png" class="rounded shadow-sm w-7 h-5">
                            <span class="font-medium text-gray-800 dark:text-gray-100">${c.name}</span>
                        </div>
                    </td>

                    <!-- CLIMA -->
                    <td class="p-3 text-center text-gray-700 dark:text-gray-300 text-sm">
                        ${weather ? `
                            <div class="flex flex-col items-center justify-center gap-1">
                                <div class="text-lg flex items-center gap-2">
                                    ${wInfo.icon}
                                    <span>${wInfo.label}</span>
                                </div>
                                <div class="text-xs opacity-80">
                                    🌡️ <b>${weather.temperature}°C</b> — 💨 ${weather.windspeed} km/h
                                </div>
                            </div>
                        ` : "No disponible"}
                    </td>
                </tr>
            `;
        }

        html += `
                    </tbody>
                </table>
            </div>
        `;

        weatherContainer.innerHTML = html;

    } catch {
        errorState.classList.remove("hidden");
    } finally {
        loadingState.classList.add("hidden");
    }
}

// =========================
// BUSCADOR
// =========================
searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase().trim();

    if (query === "") {
        clearSearch.classList.add("hidden");
        searchInfo.classList.add("hidden");
        loadWeatherTable();
        return;
    }

    clearSearch.classList.remove("hidden");

    const filtered = countries.filter(c =>
        c.name.toLowerCase().includes(query)
    );

    searchInfo.classList.remove("hidden");
    searchResultText.textContent =
        filtered.length === 0
            ? "No se encontraron países."
            : `Resultados: ${filtered.length}`;

    loadWeatherTable(filtered);
});

clearSearch.addEventListener("click", () => {
    searchInput.value = "";
    clearSearch.classList.add("hidden");
    searchInfo.classList.add("hidden");
    loadWeatherTable();
});

// =========================
// MODO OSCURO
// =========================
document.getElementById("darkModeToggle").addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");

    // Guardar preferencia
    const isDark = document.documentElement.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
});

// =========================
// APLICAR TEMA GUARDADO
// =========================
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");
} else if (savedTheme === "light") {
    document.documentElement.classList.remove("dark");
}

// =========================
// INICIO
// =========================
loadWeatherTable();
